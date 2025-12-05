import {
  Configuration,
  AccountApi,
  BlockApi,
  CandlestickApi,
  OrderApi,
  TransactionApi,
  FundingApi,
  AccountByEnum,
  BlockByEnum,
  BlocksSortEnum,
  BlockTxsByEnum,
  TxByEnum,
  CandlesticksResolutionEnum,
  FundingsResolutionEnum,
  PublicPoolsFilterEnum,
} from "../../src"
import { MAINNET_BASE_URL } from "./constants"

const L1_ADDRESS = "0x0435b1aE398D3FD9035142d529B20dd0Cf722eD7"
const ACCOUNT_INDEX = 410044
const BASE_URL = MAINNET_BASE_URL

async function printApi(
  methodName: string,
  promise: Promise<any>
): Promise<void> {
  try {
    const response = await promise
    console.log(`${methodName}:`, JSON.stringify(response.data, null, 2))
  } catch (error: any) {
    console.log(`${methodName}: Error -`, error.response?.data || error.message)
  }
}

async function accountApis(configuration: Configuration): Promise<void> {
  console.log("ACCOUNT APIS")
  const accountInstance = new AccountApi(configuration)

  await printApi(
    "account (by l1_address)",
    accountInstance.account(AccountByEnum.L1Address, L1_ADDRESS)
  )

  await printApi(
    "account (by index)",
    accountInstance.account(AccountByEnum.Index, ACCOUNT_INDEX.toString())
  )

  await printApi(
    "accountsByL1Address",
    accountInstance.accountsByL1Address(L1_ADDRESS)
  )

  await printApi("apikeys", accountInstance.apikeys(ACCOUNT_INDEX, 255))

  await printApi(
    "publicPools",
    accountInstance.publicPools(
      0,
      1,
      undefined,
      undefined,
      PublicPoolsFilterEnum.All
    )
  )
}

async function blockApis(configuration: Configuration): Promise<void> {
  console.log("\nBLOCK APIS")
  const blockInstance = new BlockApi(configuration)

  await printApi(
    "block (by height)",
    blockInstance.block(BlockByEnum.Height, "1")
  )

  await printApi("blocks", blockInstance.blocks(2, 0, BlocksSortEnum.Asc))

  await printApi("currentHeight", blockInstance.currentHeight())
}

async function candlestickApis(configuration: Configuration): Promise<void> {
  console.log("\nCANDLESTICK APIS")
  const candlestickInstance = new CandlestickApi(configuration)

  const now = Math.floor(Date.now() / 1000)
  const oneDayAgo = now - 60 * 60 * 24

  await printApi(
    "candlesticks",
    candlestickInstance.candlesticks(
      0, // market_id
      CandlesticksResolutionEnum._1h,
      oneDayAgo,
      now,
      2 // count_back
    )
  )

  await printApi(
    "fundings",
    candlestickInstance.fundings(
      0, // market_id
      FundingsResolutionEnum._1h,
      oneDayAgo,
      now,
      2 // count_back
    )
  )
}

async function orderApis(configuration: Configuration): Promise<void> {
  console.log("\nORDER APIS")
  const orderInstance = new OrderApi(configuration)

  await printApi("exchangeStats", orderInstance.exchangeStats())

  await printApi("orderBookDetails", orderInstance.orderBookDetails(32))

  await printApi("orderBooks", orderInstance.orderBooks())

  await printApi("recentTrades", orderInstance.recentTrades(0, 2))
}

async function transactionApis(configuration: Configuration): Promise<void> {
  console.log("\nTRANSACTION APIS")
  const transactionInstance = new TransactionApi(configuration)

  // await printApi(
  //   "blockTxs",
  //   transactionInstance.blockTxs(BlockTxsByEnum.BlockHeight, "94350011")
  // )

  // await printApi("nextNonce", transactionInstance.nextNonce(ACCOUNT_INDEX, 3))

  // // use with a valid hash or sequence index
  // await printApi(
  //   "tx (by sequence_index)",
  //   transactionInstance.tx(
  //     TxByEnum.Hash,
  //     "2f24824fa2ae3f4fe522ade5ac45d519492ea716f3241ca23cd561b5c661b212f50f3c283797167d"
  //   )
  // )

  await printApi("txs", transactionInstance.txs(2, 0))
}

async function fundingApis(configuration: Configuration): Promise<void> {
  console.log("\nFUNDING APIS")
  const fundingInstance = new FundingApi(configuration)

  await printApi("fundingRates", fundingInstance.fundingRates())
}

async function checkApiKeys(accountIndex: number) {
  try {
    const configuration = new Configuration({
      basePath: BASE_URL,
    })

    const accountInstance = new AccountApi(configuration)

    const { data } = await accountInstance.apikeys(accountIndex, 255)

    data.api_keys.forEach((apiKey) => {
      console.log(
        `API key n°${apiKey.api_key_index}: ${apiKey.public_key} (nonce: ${apiKey.nonce})`
      )
    })

    return data.api_keys
  } catch (error) {
    console.error("Error checking API keys:", error)
  }
}

async function getActiveOrders({
  accountIndex,
  marketId,
  auth,
}: {
  accountIndex: number
  marketId: number
  auth: string
}) {
  try {
    const configuration = new Configuration({
      basePath: BASE_URL,
    })

    const orderInstance = new OrderApi(configuration)

    const { data } = await orderInstance.accountActiveOrders(
      accountIndex,
      marketId,
      undefined,
      auth
    )

    console.log(`Active orders: ${JSON.stringify(data)}`)
  } catch (error: any) {
    console.error("Error getting active orders:", error.response.data)
  }
}

async function getOpenPositions(address: string) {
  const configuration = new Configuration({
    basePath: BASE_URL,
  })

  const accountInstance = new AccountApi(configuration)

  const { data } = await accountInstance.account(
    AccountByEnum.L1Address,
    address
  )

  const positions = data.accounts[0].positions

  return positions
}

async function main() {
  // const apiKeys = await checkApiKeys(ACCOUNT_INDEX)

  // const authToken = getCurrentAuthToken(ACCOUNT_INDEX)

  // const openPositions = await getOpenPositions(L1_ADDRESS)

  // openPositions.forEach((position) => {
  //   console.log(`Position: ${JSON.stringify(position)}\n`)
  // })

  const configuration = new Configuration({
    basePath: BASE_URL,
  })

  transactionApis(configuration)
}

main().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
