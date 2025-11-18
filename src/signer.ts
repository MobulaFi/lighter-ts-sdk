import * as koffi from "koffi"
import * as os from "os"
import * as path from "path"
import * as fs from "fs"
import { ethers } from "ethers"
import { Configuration, TransactionApi, OrderApi, RespSendTx } from "."

const CODE_OK = 200

// C structure definitions using koffi
const ApiKeyResponseStruct = koffi.struct("ApiKeyResponse", {
  privateKey: "char*",
  publicKey: "char*",
  err: "char*",
})

const StrOrErrStruct = koffi.struct("StrOrErr", {
  str: "char*",
  err: "char*",
})

const CreateOrderTxReqStruct = koffi.struct("CreateOrderTxReq", {
  MarketIndex: "uint8",
  ClientOrderIndex: "int64",
  BaseAmount: "int64",
  Price: "uint32",
  IsAsk: "uint8",
  Type: "uint8",
  TimeInForce: "uint8",
  ReduceOnly: "uint8",
  TriggerPrice: "uint32",
  OrderExpiry: "int64",
})

// Nonce Manager
enum NonceManagerType {
  OPTIMISTIC = "optimistic",
  PESSIMISTIC = "pessimistic",
}

interface NonceManager {
  next_nonce(): [number, number] // Returns [api_key_index, nonce]
  acknowledge_failure(api_key_index: number): void
  hard_refresh_nonce(api_key_index: number): void
}

class OptimisticNonceManager implements NonceManager {
  private nonces: Map<number, number> = new Map()
  private accountIndex: number
  private apiClient: TransactionApi
  private startApiKey: number
  private endApiKey: number
  private currentApiKey: number

  constructor(
    accountIndex: number,
    apiClient: TransactionApi,
    startApiKey: number,
    endApiKey: number
  ) {
    this.accountIndex = accountIndex
    this.apiClient = apiClient
    this.startApiKey = startApiKey
    this.endApiKey = endApiKey
    this.currentApiKey = startApiKey

    // Initialize nonces
    for (let i = startApiKey; i <= endApiKey; i++) {
      this.nonces.set(i, 0)
    }
  }

  async initialize(): Promise<void> {
    // Fetch initial nonces from API
    for (let i = this.startApiKey; i <= this.endApiKey; i++) {
      try {
        const response = await this.apiClient.nextNonce(this.accountIndex, i)
        if (response.data.nonce !== undefined) {
          this.nonces.set(i, response.data.nonce)
        }
      } catch (error) {
        console.warn(`Failed to fetch initial nonce for API key ${i}:`, error)
      }
    }
  }

  next_nonce(): [number, number] {
    const apiKeyIndex = this.currentApiKey
    const nonce = this.nonces.get(apiKeyIndex) || 0
    this.nonces.set(apiKeyIndex, nonce + 1)

    // Round-robin API keys
    this.currentApiKey++
    if (this.currentApiKey > this.endApiKey) {
      this.currentApiKey = this.startApiKey
    }

    return [apiKeyIndex, nonce]
  }

  acknowledge_failure(api_key_index: number): void {
    // Decrement nonce on failure
    const current = this.nonces.get(api_key_index) || 0
    if (current > 0) {
      this.nonces.set(api_key_index, current - 1)
    }
  }

  async hard_refresh_nonce(api_key_index: number): Promise<void> {
    try {
      const response = await this.apiClient.nextNonce(
        this.accountIndex,
        api_key_index
      )
      if (response.data.nonce !== undefined) {
        this.nonces.set(api_key_index, response.data.nonce)
      }
    } catch (error) {
      console.warn(
        `Failed to refresh nonce for API key ${api_key_index}:`,
        error
      )
    }
  }
}

function nonce_manager_factory(
  nonce_manager_type: NonceManagerType,
  account_index: number,
  api_client: TransactionApi,
  start_api_key: number,
  end_api_key: number
): NonceManager {
  if (nonce_manager_type === NonceManagerType.OPTIMISTIC) {
    const manager = new OptimisticNonceManager(
      account_index,
      api_client,
      start_api_key,
      end_api_key
    )
    // Initialize asynchronously (caller should await if needed)
    manager.initialize().catch(console.error)
    return manager
  }
  throw new Error(`Unsupported nonce manager type: ${nonce_manager_type}`)
}

// Export NonceManagerType for use
export { NonceManagerType }

// Transaction Models
export class CreateOrder {
  static from_json(json: string): any {
    return JSON.parse(json)
  }
}

export class CancelOrder {
  static from_json(json: string): any {
    return JSON.parse(json)
  }
}

export class Withdraw {
  static from_json(json: string): any {
    return JSON.parse(json)
  }
}

export class CreateGroupedOrders {
  static from_json(json: string): any {
    return JSON.parse(json)
  }
}

function trim_exc(exception_body: string): string {
  return exception_body.trim().split("\n").pop() || exception_body.trim()
}

function extractStrOrErr(result: any): {
  str: string | null
  err: string | null
} {
  if (!result) {
    return { str: null, err: "Null result returned" }
  }
  return {
    str: result.str || null,
    err: result.err || null,
  }
}

let cachedLibrary: any = null
let cachedFunctions: any = null
let cachedLibraryPath: string | null = null

function initialize_signer(): any {
  if (cachedFunctions) {
    return cachedFunctions
  }

  const platform = os.platform()
  const arch = os.arch()
  const isLinux = platform === "linux"
  const isMac = platform === "darwin"
  const isWindows = platform === "win32"
  const isX64 = arch === "x64"
  const isArm = arch === "arm64"

  const currentFileDirectory = __dirname
  const signersInCurrentDir = path.join(currentFileDirectory, "signers")
  const projectRoot = fs.existsSync(signersInCurrentDir)
    ? currentFileDirectory
    : path.join(currentFileDirectory, "..")
  const pathToSignerFolders = path.join(projectRoot, "signers")

  let libraryPath: string

  if (isArm && isMac) {
    libraryPath = path.join(pathToSignerFolders, "signer-arm64.dylib")
  } else if (isLinux && isX64) {
    libraryPath = path.join(pathToSignerFolders, "signer-amd64.so")
  } else if (isWindows && isX64) {
    libraryPath = path.join(pathToSignerFolders, "signer-amd64.dll")
  } else {
    throw new Error(
      `Unsupported platform/architecture: ${platform}/${arch}. ` +
        "Currently supported: Linux(x86_64), macOS(arm64), and Windows(x86_64)."
    )
  }

  libraryPath = path.resolve(path.normalize(libraryPath))

  if (!fs.existsSync(libraryPath)) {
    throw new Error(
      `Signer library not found at ${libraryPath}. ` +
        "Please ensure the signer library files are in the 'signers' directory."
    )
  }

  try {
    cachedLibrary = koffi.load(libraryPath)

    cachedFunctions = {
      GenerateAPIKey: cachedLibrary.func(
        "GenerateAPIKey",
        ApiKeyResponseStruct,
        ["str"]
      ),
      CreateClient: cachedLibrary.func("CreateClient", "str", [
        "str",
        "str",
        "int",
        "int",
        "int64",
      ]),
      CheckClient: cachedLibrary.func("CheckClient", "str", ["int", "int64"]),
      SwitchAPIKey: cachedLibrary.func("SwitchAPIKey", "str", ["int"]),
      SignChangePubKey: cachedLibrary.func("SignChangePubKey", StrOrErrStruct, [
        "str",
        "int64",
      ]),
      SignCreateOrder: cachedLibrary.func("SignCreateOrder", StrOrErrStruct, [
        "int", // market_index
        "int64", // client_order_index
        "int64", // base_amount
        "int", // price
        "int", // is_ask
        "int", // order_type
        "int", // time_in_force
        "int", // reduce_only
        "int", // trigger_price
        "int64", // order_expiry
        "int64", // nonce
      ]),
      SignCreateGroupedOrders: cachedLibrary.func(
        "SignCreateGroupedOrders",
        StrOrErrStruct,
        ["uint8", koffi.pointer("void"), "int", "int64"]
      ),
      SignCancelOrder: cachedLibrary.func("SignCancelOrder", StrOrErrStruct, [
        "int",
        "int64",
        "int64",
      ]),
      SignWithdraw: cachedLibrary.func("SignWithdraw", StrOrErrStruct, [
        "int64",
        "int64",
      ]),
      SignCreateSubAccount: cachedLibrary.func(
        "SignCreateSubAccount",
        StrOrErrStruct,
        ["int64"]
      ),
      SignCancelAllOrders: cachedLibrary.func(
        "SignCancelAllOrders",
        StrOrErrStruct,
        ["int", "int64", "int64"]
      ),
      SignModifyOrder: cachedLibrary.func("SignModifyOrder", StrOrErrStruct, [
        "int",
        "int64",
        "int64",
        "int64",
        "int64",
        "int64",
      ]),
      SignTransfer: cachedLibrary.func("SignTransfer", StrOrErrStruct, [
        "int64",
        "int64",
        "int64",
        "str",
        "int64",
      ]),
      SignCreatePublicPool: cachedLibrary.func(
        "SignCreatePublicPool",
        StrOrErrStruct,
        ["int64", "int64", "int64", "int64"]
      ),
      SignUpdatePublicPool: cachedLibrary.func(
        "SignUpdatePublicPool",
        StrOrErrStruct,
        ["int64", "int", "int64", "int64", "int64"]
      ),
      SignMintShares: cachedLibrary.func("SignMintShares", StrOrErrStruct, [
        "int64",
        "int64",
        "int64",
      ]),
      SignBurnShares: cachedLibrary.func("SignBurnShares", StrOrErrStruct, [
        "int64",
        "int64",
        "int64",
      ]),
      SignUpdateLeverage: cachedLibrary.func(
        "SignUpdateLeverage",
        StrOrErrStruct,
        ["int", "int", "int", "int64"]
      ),
      CreateAuthToken: cachedLibrary.func("CreateAuthToken", StrOrErrStruct, [
        "int64",
      ]),
    }

    cachedLibraryPath = libraryPath
    return cachedFunctions
  } catch (error: any) {
    let errorMessage = "Unknown error"

    if (error) {
      if (error.message) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      } else {
        errorMessage = String(error)
      }
    }

    throw new Error(
      `Failed to load signer library from ${libraryPath}: ${errorMessage}. `
    )
  }
}

// Standalone function to create API key
export function create_api_key(
  seed: string = ""
): [string | null, string | null, string | null] {
  const signer = initialize_signer()
  const result = signer.GenerateAPIKey(seed)

  if (!result) {
    return [null, null, "Failed to generate API key: null result returned"]
  }

  const privateKeyStr = result.privateKey || null
  const publicKeyStr = result.publicKey || null
  const error = result.err || null

  return [privateKeyStr, publicKeyStr, error]
}

// SignerClient class
export interface SignerClientOptions {
  max_api_key_index?: number
  private_keys?: { [key: number]: string }
  nonce_management_type?: NonceManagerType
}

export class SignerClient {
  static readonly USDC_TICKER_SCALE = 1e6

  static readonly TX_TYPE_CHANGE_PUB_KEY = 8
  static readonly TX_TYPE_CREATE_SUB_ACCOUNT = 9
  static readonly TX_TYPE_CREATE_PUBLIC_POOL = 10
  static readonly TX_TYPE_UPDATE_PUBLIC_POOL = 11
  static readonly TX_TYPE_TRANSFER = 12
  static readonly TX_TYPE_WITHDRAW = 13
  static readonly TX_TYPE_CREATE_ORDER = 14
  static readonly TX_TYPE_CANCEL_ORDER = 15
  static readonly TX_TYPE_CANCEL_ALL_ORDERS = 16
  static readonly TX_TYPE_MODIFY_ORDER = 17
  static readonly TX_TYPE_MINT_SHARES = 18
  static readonly TX_TYPE_BURN_SHARES = 19
  static readonly TX_TYPE_UPDATE_LEVERAGE = 20
  static readonly TX_TYPE_CREATE_GROUP_ORDER = 28

  static readonly ORDER_TYPE_LIMIT = 0
  static readonly ORDER_TYPE_MARKET = 1
  static readonly ORDER_TYPE_STOP_LOSS = 2
  static readonly ORDER_TYPE_STOP_LOSS_LIMIT = 3
  static readonly ORDER_TYPE_TAKE_PROFIT = 4
  static readonly ORDER_TYPE_TAKE_PROFIT_LIMIT = 5
  static readonly ORDER_TYPE_TWAP = 6

  static readonly ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL = 0
  static readonly ORDER_TIME_IN_FORCE_GOOD_TILL_TIME = 1
  static readonly ORDER_TIME_IN_FORCE_POST_ONLY = 2

  static readonly CANCEL_ALL_TIF_IMMEDIATE = 0
  static readonly CANCEL_ALL_TIF_SCHEDULED = 1
  static readonly CANCEL_ALL_TIF_ABORT = 2

  static readonly NIL_TRIGGER_PRICE = 0
  static readonly DEFAULT_28_DAY_ORDER_EXPIRY = -1
  static readonly DEFAULT_IOC_EXPIRY = 0
  static readonly DEFAULT_10_MIN_AUTH_EXPIRY = -1
  static readonly MINUTE = 60

  static readonly CROSS_MARGIN_MODE = 0
  static readonly ISOLATED_MARGIN_MODE = 1

  static readonly GROUPING_TYPE_ONE_TRIGGERS_THE_OTHER = 1
  static readonly GROUPING_TYPE_ONE_CANCELS_THE_OTHER = 2
  static readonly GROUPING_TYPE_ONE_TRIGGERS_A_ONE_CANCELS_THE_OTHER = 3

  private url: string
  private private_key: string
  private chain_id: number
  private api_key_index: number
  private end_api_key_index: number
  private api_key_dict: { [key: number]: string }
  private account_index: number
  private signer: any
  private tx_api: TransactionApi
  private order_api: OrderApi
  private nonce_manager: NonceManager

  constructor(
    url: string,
    private_key: string,
    api_key_index: number,
    account_index: number,
    options: SignerClientOptions = {}
  ) {
    const {
      max_api_key_index = -1,
      private_keys = {},
      nonce_management_type = NonceManagerType.OPTIMISTIC,
    } = options

    this.chain_id = url.includes("mainnet") ? 304 : 300

    // Remove 0x prefix if present
    if (private_key.startsWith("0x")) {
      private_key = private_key.slice(2)
    }

    this.url = url
    this.private_key = private_key
    this.api_key_index = api_key_index
    this.end_api_key_index =
      max_api_key_index === -1 ? api_key_index : max_api_key_index

    this.validate_api_private_keys(private_key, private_keys)
    this.api_key_dict = this.build_api_key_dict(private_key, private_keys)
    this.account_index = account_index
    this.signer = initialize_signer()

    const configuration = new Configuration({ basePath: url })
    this.tx_api = new TransactionApi(configuration)
    this.order_api = new OrderApi(configuration)

    this.nonce_manager = nonce_manager_factory(
      nonce_management_type,
      account_index,
      this.tx_api,
      this.api_key_index,
      this.end_api_key_index
    )

    // Create clients for all API keys
    for (
      let api_key = this.api_key_index;
      api_key <= this.end_api_key_index;
      api_key++
    ) {
      this.create_client(api_key)
    }
  }

  private validate_api_private_keys(
    initial_private_key: string,
    private_keys: { [key: number]: string }
  ): void {
    if (
      Object.keys(private_keys).length ===
      this.end_api_key_index - this.api_key_index + 1
    ) {
      if (
        !SignerClient.are_keys_equal(
          private_keys[this.api_key_index],
          initial_private_key
        )
      ) {
        throw new Error("inconsistent private keys")
      }
      return
    }

    if (
      Object.keys(private_keys).length !==
      this.end_api_key_index - this.api_key_index
    ) {
      throw new Error("unexpected number of private keys")
    }

    for (
      let api_key = this.api_key_index + 1;
      api_key < this.end_api_key_index;
      api_key++
    ) {
      if (!(api_key in private_keys)) {
        throw new Error(`missing ${api_key} private key!`)
      }
    }
  }

  private build_api_key_dict(
    private_key: string,
    private_keys: { [key: number]: string }
  ): { [key: number]: string } {
    if (
      Object.keys(private_keys).length ===
      this.end_api_key_index - this.api_key_index
    ) {
      private_keys[this.api_key_index] = private_key
    }
    return private_keys
  }

  private create_client(api_key_index?: number): void {
    const keyIndex = api_key_index ?? this.api_key_index

    const apiKey = this.api_key_dict[keyIndex]

    const err = this.signer.CreateClient(
      this.url,
      apiKey,
      this.chain_id,
      keyIndex,
      this.account_index
    )

    if (err) {
      throw new Error(err)
    }
  }

  check_client(): string | null {
    let result: any = null
    for (
      let api_key = this.api_key_index;
      api_key <= this.end_api_key_index;
      api_key++
    ) {
      result = this.signer.CheckClient(api_key, this.account_index)
      if (result) {
        return result + ` on api key ${this.api_key_index}`
      }
    }
    return result || null
  }

  switch_api_key(api_key: number): string | null {
    const result = this.signer.SwitchAPIKey(api_key)
    return result || null
  }

  create_api_key(
    seed: string = ""
  ): [string | null, string | null, string | null] {
    const result = this.signer.GenerateAPIKey(seed)

    if (!result) {
      return [null, null, "Failed to generate API key: null result returned"]
    }

    // With koffi, structs are returned directly as objects
    const privateKeyStr = result.privateKey || null
    const publicKeyStr = result.publicKey || null
    const error = result.err || null

    return [privateKeyStr, publicKeyStr, error]
  }

  async sign_change_api_key(
    eth_private_key: string,
    new_pubkey: string,
    nonce: number
  ): Promise<[string | null, string | null]> {
    const result = this.signer.SignChangePubKey(new_pubkey, nonce)

    if (!result) {
      return [null, "Failed to sign change API key: null result returned"]
    }

    // With koffi, structs are returned directly as objects
    const { str: txInfoStr, err: error } = extractStrOrErr(result)

    if (error) {
      return [null, error]
    }

    if (!txInfoStr) {
      return [null, "No transaction info returned"]
    }

    // Fetch message to sign
    const txInfo = JSON.parse(txInfoStr)
    const msgToSign = txInfo.MessageToSign
    delete txInfo.MessageToSign

    // Sign the message (ethers.js handles the Ethereum message prefix automatically)
    const wallet = new ethers.Wallet(eth_private_key)
    const signature = await wallet.signMessage(msgToSign)
    txInfo.L1Sig = signature

    return [JSON.stringify(txInfo), null]
  }

  get_api_key_nonce(api_key_index: number, nonce: number): [number, number] {
    if (api_key_index !== -1 && nonce !== -1) {
      return [api_key_index, nonce]
    }
    if (nonce !== -1) {
      if (this.api_key_index === this.end_api_key_index) {
        return this.nonce_manager.next_nonce()
      } else {
        throw new Error("ambiguous api key")
      }
    }
    return this.nonce_manager.next_nonce()
  }

  sign_create_order(
    market_index: number,
    client_order_index: number,
    base_amount: number,
    price: number,
    is_ask: boolean,
    order_type: number,
    time_in_force: number,
    reduce_only: boolean,
    trigger_price: number,
    order_expiry: number,
    nonce: number
  ): [string | null, string | null] {
    const result = this.signer.SignCreateOrder(
      market_index,
      client_order_index,
      base_amount,
      price,
      is_ask ? 1 : 0,
      order_type,
      time_in_force,
      reduce_only ? 1 : 0,
      trigger_price,
      order_expiry,
      nonce
    )

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  sign_create_grouped_orders(
    grouping_type: number,
    orders: any[],
    nonce: number
  ): [string | null, string | null] {
    // With koffi, we need to manually pack struct data into a buffer
    // CreateOrderTxReq struct layout: uint8, int64, int64, uint32, uint8, uint8, uint8, uint8, uint32, int64
    // Total size: 1 + 8 + 8 + 4 + 1 + 1 + 1 + 1 + 4 + 8 = 37 bytes (with padding, likely 40 or 48)
    // Let's use koffi's struct size calculation
    const structSize = koffi.sizeof(CreateOrderTxReqStruct)
    const arraySize = orders.length * structSize
    const ordersPtr = Buffer.alloc(arraySize)

    // Write each struct to the allocated memory
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i]
      const offset = i * structSize

      // Pack struct fields into buffer manually
      // MarketIndex: uint8 at offset 0
      ordersPtr.writeUInt8(order.MarketIndex, offset)
      // ClientOrderIndex: int64 at offset 8 (with padding)
      ordersPtr.writeBigInt64LE(BigInt(order.ClientOrderIndex), offset + 8)
      // BaseAmount: int64 at offset 16
      ordersPtr.writeBigInt64LE(BigInt(order.BaseAmount), offset + 16)
      // Price: uint32 at offset 24
      ordersPtr.writeUInt32LE(order.Price, offset + 24)
      // IsAsk: uint8 at offset 28
      ordersPtr.writeUInt8(order.IsAsk, offset + 28)
      // Type: uint8 at offset 29
      ordersPtr.writeUInt8(order.Type, offset + 29)
      // TimeInForce: uint8 at offset 30
      ordersPtr.writeUInt8(order.TimeInForce, offset + 30)
      // ReduceOnly: uint8 at offset 31
      ordersPtr.writeUInt8(order.ReduceOnly, offset + 31)
      // TriggerPrice: uint32 at offset 32
      ordersPtr.writeUInt32LE(order.TriggerPrice, offset + 32)
      // OrderExpiry: int64 at offset 40 (with padding)
      ordersPtr.writeBigInt64LE(BigInt(order.OrderExpiry), offset + 40)
    }

    const result = this.signer.SignCreateGroupedOrders(
      grouping_type,
      ordersPtr,
      orders.length,
      nonce
    )

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  sign_cancel_order(
    market_index: number,
    order_index: number,
    nonce: number
  ): [string | null, string | null] {
    const result = this.signer.SignCancelOrder(market_index, order_index, nonce)

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  sign_withdraw(
    usdc_amount: number,
    nonce: number
  ): [string | null, string | null] {
    const result = this.signer.SignWithdraw(usdc_amount, nonce)

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  sign_create_sub_account(nonce: number): [string | null, string | null] {
    const result = this.signer.SignCreateSubAccount(nonce)

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  sign_cancel_all_orders(
    time_in_force: number,
    time: number,
    nonce: number
  ): [string | null, string | null] {
    const result = this.signer.SignCancelAllOrders(time_in_force, time, nonce)

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  sign_modify_order(
    market_index: number,
    order_index: number,
    base_amount: number,
    price: number,
    trigger_price: number,
    nonce: number
  ): [string | null, string | null] {
    const result = this.signer.SignModifyOrder(
      market_index,
      order_index,
      base_amount,
      price,
      trigger_price,
      nonce
    )

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  async sign_transfer(
    eth_private_key: string,
    to_account_index: number,
    usdc_amount: number,
    fee: number,
    memo: string,
    nonce: number
  ): Promise<[string | null, string | null]> {
    const result = this.signer.SignTransfer(
      to_account_index,
      usdc_amount,
      fee,
      memo,
      nonce
    )

    const { str: txInfoStr, err: error } = extractStrOrErr(result)

    if (error) {
      return [txInfoStr, error]
    }

    if (!txInfoStr) {
      return [null, "No transaction info returned"]
    }

    // Fetch message to sign
    const txInfo = JSON.parse(txInfoStr)
    const msgToSign = txInfo.MessageToSign
    delete txInfo.MessageToSign

    // Sign the message (ethers.js handles the Ethereum message prefix automatically)
    const wallet = new ethers.Wallet(eth_private_key)
    const signature = await wallet.signMessage(msgToSign)
    txInfo.L1Sig = signature

    return [JSON.stringify(txInfo), null]
  }

  sign_create_public_pool(
    operator_fee: number,
    initial_total_shares: number,
    min_operator_share_rate: number,
    nonce: number
  ): [string | null, string | null] {
    const result = this.signer.SignCreatePublicPool(
      operator_fee,
      initial_total_shares,
      min_operator_share_rate,
      nonce
    )

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  sign_update_public_pool(
    public_pool_index: number,
    status: number,
    operator_fee: number,
    min_operator_share_rate: number,
    nonce: number
  ): [string | null, string | null] {
    const result = this.signer.SignUpdatePublicPool(
      public_pool_index,
      status,
      operator_fee,
      min_operator_share_rate,
      nonce
    )

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  sign_mint_shares(
    public_pool_index: number,
    share_amount: number,
    nonce: number
  ): [string | null, string | null] {
    const result = this.signer.SignMintShares(
      public_pool_index,
      share_amount,
      nonce
    )

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  sign_burn_shares(
    public_pool_index: number,
    share_amount: number,
    nonce: number
  ): [string | null, string | null] {
    const result = this.signer.SignBurnShares(
      public_pool_index,
      share_amount,
      nonce
    )

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  sign_update_leverage(
    market_index: number,
    fraction: number,
    margin_mode: number,
    nonce: number
  ): [string | null, string | null] {
    const result = this.signer.SignUpdateLeverage(
      market_index,
      fraction,
      margin_mode,
      nonce
    )

    const { str: txInfo, err: error } = extractStrOrErr(result)
    return [txInfo, error]
  }

  create_auth_token_with_expiry(
    deadline: number = SignerClient.DEFAULT_10_MIN_AUTH_EXPIRY,
    timestamp?: number
  ): [string | null, string | null] {
    let actualDeadline = deadline
    if (deadline === SignerClient.DEFAULT_10_MIN_AUTH_EXPIRY) {
      actualDeadline = 10 * SignerClient.MINUTE
    }
    const actualTimestamp = timestamp ?? Math.floor(Date.now() / 1000)

    const result = this.signer.CreateAuthToken(actualTimestamp + actualDeadline)

    const { str: auth, err: error } = extractStrOrErr(result)
    return [auth, error]
  }

  private async process_api_key_and_nonce<T extends any[]>(
    func: (...args: any[]) => Promise<any>,
    api_key_index: number,
    nonce: number,
    ...args: T
  ): Promise<any> {
    let actualApiKeyIndex = api_key_index
    let actualNonce = nonce

    if (api_key_index === -1 && nonce === -1) {
      ;[actualApiKeyIndex, actualNonce] = this.nonce_manager.next_nonce()
    }

    const err = this.switch_api_key(actualApiKeyIndex)
    if (err) {
      throw new Error(`error switching api key: ${err}`)
    }

    try {
      const result = await func(...args, actualNonce, actualApiKeyIndex)
      const [created_tx, ret, err] = result

      if ((ret === null && err) || (ret && ret.code !== CODE_OK)) {
        this.nonce_manager.acknowledge_failure(actualApiKeyIndex)
      }

      return result
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.message?.includes("invalid nonce")
      ) {
        if (this.nonce_manager instanceof OptimisticNonceManager) {
          await this.nonce_manager.hard_refresh_nonce(actualApiKeyIndex)
        }
        return [null, null, trim_exc(error.message || String(error))]
      } else {
        this.nonce_manager.acknowledge_failure(actualApiKeyIndex)
        return [null, null, trim_exc(error.message || String(error))]
      }
    }
  }

  async change_api_key(
    eth_private_key: string,
    new_pubkey: string,
    nonce: number = -1
  ): Promise<[any, string | null]> {
    const tx_info = await this.sign_change_api_key(
      eth_private_key,
      new_pubkey,
      nonce
    )
    const [txInfo, error] = tx_info
    if (error) {
      return [null, error]
    }

    if (!txInfo) {
      return [null, "No transaction info"]
    }

    const api_response = await this.send_tx(
      SignerClient.TX_TYPE_CHANGE_PUB_KEY,
      txInfo
    )
    return [api_response, null]
  }

  async create_order(
    market_index: number,
    client_order_index: number,
    base_amount: number,
    price: number,
    is_ask: boolean,
    order_type: number,
    time_in_force: number,
    reduce_only: boolean = false,
    trigger_price: number = SignerClient.NIL_TRIGGER_PRICE,
    order_expiry: number = SignerClient.DEFAULT_28_DAY_ORDER_EXPIRY,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[any, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const tx_info = this.sign_create_order(
          market_index,
          client_order_index,
          base_amount,
          price,
          is_ask,
          order_type,
          time_in_force,
          reduce_only,
          trigger_price,
          order_expiry,
          n
        )
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_CREATE_ORDER,
          txInfo
        )
        return [CreateOrder.from_json(txInfo), api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async create_grouped_orders(
    grouping_type: number,
    orders: any[],
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[any, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const tx_info = this.sign_create_grouped_orders(
          grouping_type,
          orders,
          n
        )
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_CREATE_GROUP_ORDER,
          txInfo
        )
        return [CreateGroupedOrders.from_json(txInfo), api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async create_market_order(
    market_index: number,
    client_order_index: number,
    base_amount: number,
    avg_execution_price: number,
    is_ask: boolean,
    reduce_only: boolean = false,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[any, RespSendTx | null, string | null]> {
    return this.create_order(
      market_index,
      client_order_index,
      base_amount,
      avg_execution_price,
      is_ask,
      SignerClient.ORDER_TYPE_MARKET,
      SignerClient.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
      reduce_only,
      SignerClient.NIL_TRIGGER_PRICE,
      SignerClient.DEFAULT_IOC_EXPIRY,
      nonce,
      api_key_index
    )
  }

  async create_market_order_limited_slippage(
    market_index: number,
    client_order_index: number,
    base_amount: number,
    max_slippage: number,
    is_ask: boolean,
    reduce_only: boolean = false,
    nonce: number = -1,
    api_key_index: number = -1,
    ideal_price?: number
  ): Promise<[any, RespSendTx | null, string | null]> {
    let actualIdealPrice = ideal_price
    if (actualIdealPrice === undefined) {
      const order_book_orders = await this.order_api.orderBookOrders(
        market_index,
        1
      )
      const priceStr = is_ask
        ? order_book_orders.data.bids?.[0]?.price
        : order_book_orders.data.asks?.[0]?.price
      if (!priceStr) {
        throw new Error("No price available in order book")
      }
      actualIdealPrice = parseInt(priceStr.replace(".", ""))
    }

    const acceptable_execution_price = Math.round(
      actualIdealPrice * (1 + max_slippage * (is_ask ? -1 : 1))
    )

    return this.create_order(
      market_index,
      client_order_index,
      base_amount,
      acceptable_execution_price,
      is_ask,
      SignerClient.ORDER_TYPE_MARKET,
      SignerClient.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
      reduce_only,
      SignerClient.NIL_TRIGGER_PRICE,
      SignerClient.DEFAULT_IOC_EXPIRY,
      nonce,
      api_key_index
    )
  }

  async create_market_order_if_slippage(
    market_index: number,
    client_order_index: number,
    base_amount: number,
    max_slippage: number,
    is_ask: boolean,
    reduce_only: boolean = false,
    nonce: number = -1,
    api_key_index: number = -1,
    ideal_price?: number
  ): Promise<[any, RespSendTx | null, string | null]> {
    const order_book_orders = await this.order_api.orderBookOrders(
      market_index,
      100
    )
    let actualIdealPrice = ideal_price
    if (actualIdealPrice === undefined) {
      const priceStr = is_ask
        ? order_book_orders.data.bids?.[0]?.price
        : order_book_orders.data.asks?.[0]?.price
      if (!priceStr) {
        throw new Error("No price available in order book")
      }
      actualIdealPrice = parseInt(priceStr.replace(".", ""))
    }

    let matched_usd_amount = 0
    let matched_size = 0
    const orders = is_ask
      ? order_book_orders.data.bids || []
      : order_book_orders.data.asks || []

    for (const order_book_order of orders) {
      if (matched_size === base_amount) {
        break
      }
      const curr_order_price = parseInt(order_book_order.price.replace(".", ""))
      const curr_order_size = parseInt(
        order_book_order.remaining_base_amount.replace(".", "")
      )
      const to_be_used_order_size = Math.min(
        base_amount - matched_size,
        curr_order_size
      )
      matched_usd_amount += curr_order_price * to_be_used_order_size
      matched_size += to_be_used_order_size
    }

    const potential_execution_price = matched_usd_amount / matched_size
    const acceptable_execution_price =
      actualIdealPrice * (1 + max_slippage * (is_ask ? -1 : 1))

    if (
      (is_ask && potential_execution_price < acceptable_execution_price) ||
      (!is_ask && potential_execution_price > acceptable_execution_price)
    ) {
      return [null, null, "Excessive slippage"]
    }

    if (matched_size < base_amount) {
      return [
        null,
        null,
        "Cannot be sure slippage will be acceptable due to the high size",
      ]
    }

    return this.create_order(
      market_index,
      client_order_index,
      base_amount,
      Math.round(acceptable_execution_price),
      is_ask,
      SignerClient.ORDER_TYPE_MARKET,
      SignerClient.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
      reduce_only,
      SignerClient.NIL_TRIGGER_PRICE,
      SignerClient.DEFAULT_IOC_EXPIRY,
      nonce,
      api_key_index
    )
  }

  async cancel_order(
    market_index: number,
    order_index: number,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[any, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const tx_info = this.sign_cancel_order(market_index, order_index, n)
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_CANCEL_ORDER,
          txInfo
        )
        return [CancelOrder.from_json(txInfo), api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async create_tp_order(
    market_index: number,
    client_order_index: number,
    base_amount: number,
    trigger_price: number,
    price: number,
    is_ask: boolean,
    reduce_only: boolean = false,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[any, RespSendTx | null, string | null]> {
    return this.create_order(
      market_index,
      client_order_index,
      base_amount,
      price,
      is_ask,
      SignerClient.ORDER_TYPE_TAKE_PROFIT,
      SignerClient.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
      reduce_only,
      trigger_price,
      SignerClient.DEFAULT_28_DAY_ORDER_EXPIRY,
      nonce,
      api_key_index
    )
  }

  async create_tp_limit_order(
    market_index: number,
    client_order_index: number,
    base_amount: number,
    trigger_price: number,
    price: number,
    is_ask: boolean,
    reduce_only: boolean = false,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[any, RespSendTx | null, string | null]> {
    return this.create_order(
      market_index,
      client_order_index,
      base_amount,
      price,
      is_ask,
      SignerClient.ORDER_TYPE_TAKE_PROFIT_LIMIT,
      SignerClient.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
      reduce_only,
      trigger_price,
      SignerClient.DEFAULT_28_DAY_ORDER_EXPIRY,
      nonce,
      api_key_index
    )
  }

  async create_sl_order(
    market_index: number,
    client_order_index: number,
    base_amount: number,
    trigger_price: number,
    price: number,
    is_ask: boolean,
    reduce_only: boolean = false,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[any, RespSendTx | null, string | null]> {
    return this.create_order(
      market_index,
      client_order_index,
      base_amount,
      price,
      is_ask,
      SignerClient.ORDER_TYPE_STOP_LOSS,
      SignerClient.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
      reduce_only,
      trigger_price,
      SignerClient.DEFAULT_28_DAY_ORDER_EXPIRY,
      nonce,
      api_key_index
    )
  }

  async create_sl_limit_order(
    market_index: number,
    client_order_index: number,
    base_amount: number,
    trigger_price: number,
    price: number,
    is_ask: boolean,
    reduce_only: boolean = false,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[any, RespSendTx | null, string | null]> {
    return this.create_order(
      market_index,
      client_order_index,
      base_amount,
      price,
      is_ask,
      SignerClient.ORDER_TYPE_STOP_LOSS_LIMIT,
      SignerClient.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
      reduce_only,
      trigger_price,
      SignerClient.DEFAULT_28_DAY_ORDER_EXPIRY,
      nonce,
      api_key_index
    )
  }

  async withdraw(
    usdc_amount: number,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[any, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const usdcAmountScaled = Math.floor(
          usdc_amount * SignerClient.USDC_TICKER_SCALE
        )
        const tx_info = this.sign_withdraw(usdcAmountScaled, n)
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_WITHDRAW,
          txInfo
        )
        return [Withdraw.from_json(txInfo), api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async create_sub_account(
    nonce: number = -1
  ): Promise<[string | null, RespSendTx | null, string | null]> {
    const tx_info = this.sign_create_sub_account(nonce)
    const [txInfo, error] = tx_info
    if (error) {
      return [null, null, error]
    }

    if (!txInfo) {
      return [null, null, "No transaction info"]
    }

    const api_response = await this.send_tx(
      SignerClient.TX_TYPE_CREATE_SUB_ACCOUNT,
      txInfo
    )
    return [txInfo, api_response, null]
  }

  async cancel_all_orders(
    time_in_force: number,
    time: number,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[string | null, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const tx_info = this.sign_cancel_all_orders(time_in_force, time, n)
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_CANCEL_ALL_ORDERS,
          txInfo
        )
        return [txInfo, api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async modify_order(
    market_index: number,
    order_index: number,
    base_amount: number,
    price: number,
    trigger_price: number,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[string | null, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const tx_info = this.sign_modify_order(
          market_index,
          order_index,
          base_amount,
          price,
          trigger_price,
          n
        )
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_MODIFY_ORDER,
          txInfo
        )
        return [txInfo, api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async transfer(
    eth_private_key: string,
    to_account_index: number,
    usdc_amount: number,
    fee: number,
    memo: string,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[string | null, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const usdcAmountScaled = Math.floor(
          usdc_amount * SignerClient.USDC_TICKER_SCALE
        )
        const tx_info = await this.sign_transfer(
          eth_private_key,
          to_account_index,
          usdcAmountScaled,
          fee,
          memo,
          n
        )
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_TRANSFER,
          txInfo
        )
        return [txInfo, api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async create_public_pool(
    operator_fee: number,
    initial_total_shares: number,
    min_operator_share_rate: number,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[string | null, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const tx_info = this.sign_create_public_pool(
          operator_fee,
          initial_total_shares,
          min_operator_share_rate,
          n
        )
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_CREATE_PUBLIC_POOL,
          txInfo
        )
        return [txInfo, api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async update_public_pool(
    public_pool_index: number,
    status: number,
    operator_fee: number,
    min_operator_share_rate: number,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[string | null, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const tx_info = this.sign_update_public_pool(
          public_pool_index,
          status,
          operator_fee,
          min_operator_share_rate,
          n
        )
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_UPDATE_PUBLIC_POOL,
          txInfo
        )
        return [txInfo, api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async mint_shares(
    public_pool_index: number,
    share_amount: number,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[string | null, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const tx_info = this.sign_mint_shares(
          public_pool_index,
          share_amount,
          n
        )
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_MINT_SHARES,
          txInfo
        )
        return [txInfo, api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async burn_shares(
    public_pool_index: number,
    share_amount: number,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[string | null, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const tx_info = this.sign_burn_shares(
          public_pool_index,
          share_amount,
          n
        )
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_BURN_SHARES,
          txInfo
        )
        return [txInfo, api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async update_leverage(
    market_index: number,
    margin_mode: number,
    leverage: number,
    nonce: number = -1,
    api_key_index: number = -1
  ): Promise<[string | null, RespSendTx | null, string | null]> {
    return this.process_api_key_and_nonce(
      async (n: number, ak: number) => {
        const imf = Math.floor(10_000 / leverage)
        const tx_info = this.sign_update_leverage(
          market_index,
          imf,
          margin_mode,
          n
        )
        const [txInfo, error] = tx_info
        if (error) {
          return [null, null, error]
        }

        if (!txInfo) {
          return [null, null, "No transaction info"]
        }

        const api_response = await this.send_tx(
          SignerClient.TX_TYPE_UPDATE_LEVERAGE,
          txInfo
        )
        return [txInfo, api_response, null]
      },
      api_key_index,
      nonce
    )
  }

  async send_tx(tx_type: number, tx_info: string): Promise<RespSendTx> {
    if (tx_info[0] !== "{") {
      throw new Error(tx_info)
    }
    const response = await this.tx_api.sendTx(tx_type, tx_info)
    return response.data
  }

  async close(): Promise<void> {
    // Cleanup if needed
  }

  static are_keys_equal(key1: string, key2: string): boolean {
    let start_index1 = 0
    let start_index2 = 0
    if (key1.startsWith("0x")) {
      start_index1 = 2
    }
    if (key2.startsWith("0x")) {
      start_index2 = 2
    }
    return key1.slice(start_index1) === key2.slice(start_index2)
  }
}
