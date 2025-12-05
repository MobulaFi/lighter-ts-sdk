import axios from "axios"
import { Wallet } from "ethers"
import { AccountApi, Configuration, InfoApi, TransactionApi } from "../../src"
import { SignerClient } from "../../src/signer"
import { MAINNET_BASE_URL } from "./constants"
import { AxiosError } from "axios"

const BASE_URL = MAINNET_BASE_URL
const API_KEY_INDEX = 3
const API_KEY_PRIVATE_KEY = process.env.API_KEY_PRIVATE_KEY
const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY

function hex16(n: number): string {
  return (BigInt(n) & 0xffffffffffffffffn).toString(16).padStart(16, "0")
}

async function getAccountIndex(ethAddress: string): Promise<number | null> {
  const configuration = new Configuration({
    basePath: MAINNET_BASE_URL,
  })

  const apiClient = new AccountApi(configuration)

  let accountIndex: number | null = null

  try {
    const response = await apiClient.accountsByL1Address(ethAddress)
    const subAccounts = response.data.sub_accounts

    if (subAccounts.length > 0) {
      accountIndex = subAccounts[0].index
    }

    if (!accountIndex) {
      throw new Error("Account index not found")
    }

    return accountIndex
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        console.error(`Account not found for ${ethAddress}`)
        return null
      }
    }

    console.error(`Error getting account index for ${ethAddress}: ${error}`)
    return null
  }
}

async function fastWithdraw({
  amountUsdc,
  ethPrivateKey,
  apiKeyPrivateKey,
}: {
  amountUsdc: number
  ethPrivateKey?: string
  apiKeyPrivateKey?: string
}) {
  if (!apiKeyPrivateKey) {
    throw new Error("api key private key is not set")
  }

  if (!ethPrivateKey) {
    throw new Error("eth private key is not set")
  }

  const configuration = new Configuration({ basePath: BASE_URL })

  const ethAccount = new Wallet(ethPrivateKey)
  const ethAddress = ethAccount.address

  const accountIndex = await getAccountIndex(ethAddress)

  if (!accountIndex) {
    throw new Error("Account index not found")
  }

  const client = new SignerClient(
    BASE_URL,
    apiKeyPrivateKey,
    API_KEY_INDEX,
    accountIndex
  )

  const err = client.check_client()

  if (err) {
    throw new Error(`API key verification failed: ${err}`)
  }

  const [auth_token, auth_err] = client.create_auth_token_with_expiry()

  if (auth_err) {
    throw new Error(`Auth token failed: ${auth_err}`)
  }

  const info_api = new InfoApi(configuration)
  const tx_api = new TransactionApi(configuration)

  try {
    const poolResponse = await axios.get(
      `${BASE_URL}/api/v1/fastwithdraw/info`,
      {
        params: { account_index: accountIndex },
        headers: { Authorization: auth_token! },
      }
    )

    const pool_info = poolResponse.data

    if (pool_info.code !== 200) {
      throw new Error(`Pool info failed: ${pool_info.message}`)
    }

    const to_account = pool_info.to_account_index
    console.log(
      `Pool: ${to_account}, Limit: ${pool_info.withdraw_limit || "N/A"}`
    )

    const fee_info = await info_api.transferFeeInfo(
      accountIndex,
      undefined,
      auth_token!,
      to_account
    )
    const nonce_info = await tx_api.nextNonce(accountIndex, API_KEY_INDEX)

    const addr_hex = ethAddress.toLowerCase().replace(/^0x/, "")
    const addr_bytes = Buffer.from(addr_hex, "hex")

    if (addr_bytes.length !== 20) {
      throw new Error(`Invalid address length: ${addr_bytes.length}`)
    }

    const memo_list = Array.from(Buffer.concat([addr_bytes, Buffer.alloc(12)]))

    // Sign L1 message
    const usdc_int = Math.floor(amountUsdc * 1e6)
    const nonce = nonce_info.data.nonce
    const fee = fee_info.data.transfer_fee_usdc

    // Validate values
    if (nonce === undefined || nonce === null) {
      throw new Error(
        `Invalid nonce: ${nonce}. Response: ${JSON.stringify(nonce_info.data)}`
      )
    }
    if (fee === undefined || fee === null) {
      throw new Error(
        `Invalid fee: ${fee}. Response: ${JSON.stringify(fee_info.data)}`
      )
    }
    if (to_account === undefined || to_account === null) {
      throw new Error(
        `Invalid to_account: ${to_account}. Response: ${JSON.stringify(
          pool_info
        )}`
      )
    }
    if (accountIndex === undefined || accountIndex === null) {
      throw new Error(`Invalid accountIndex: ${accountIndex}`)
    }

    // Ensure values are numbers
    const nonceNum = Number(nonce)
    const feeNum = Number(fee)
    const toAccountNum = Number(to_account)
    const accountIndexNum = Number(accountIndex)
    const apiKeyIndexNum = Number(API_KEY_INDEX)
    const usdcIntNum = Number(usdc_int)

    console.log("nonceNum", nonceNum)
    console.log("feeNum", feeNum)
    console.log("toAccountNum", toAccountNum)
    console.log("accountIndexNum", accountIndexNum)
    console.log("apiKeyIndexNum", apiKeyIndexNum)
    console.log("usdcIntNum", usdcIntNum)

    const memo_hex = memo_list
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    const l1_msg = `Transfer

nonce: 0x${hex16(nonceNum)}
from: 0x${hex16(accountIndexNum)}
api key: 0x${hex16(apiKeyIndexNum)}
to: 0x${hex16(toAccountNum)}
amount: 0x${hex16(usdcIntNum)}
fee: 0x${hex16(feeNum)}
memo: ${memo_hex}
Only sign this message for a trusted client!`

    // Sign L1 message
    const l1_sig = await ethAccount.signMessage(l1_msg)

    const [temp_tx, sign_err] = await client.sign_transfer(
      ethPrivateKey,
      to_account,
      usdc_int,
      fee,
      "X".repeat(32),
      nonce
    )

    if (sign_err) {
      throw new Error(`L2 signing failed: ${sign_err}`)
    }

    if (!temp_tx) {
      throw new Error("No transaction info returned")
    }

    const tx_info = JSON.parse(temp_tx)
    tx_info.Memo = memo_list
    tx_info.L1Sig = l1_sig

    console.log("Transaction info:")
    console.log("  L1Sig:", tx_info.L1Sig)
    console.log("  Memo length:", tx_info.Memo?.length)
    console.log("  FromAccountIndex:", tx_info.FromAccountIndex)
    console.log("  ToAccountIndex:", tx_info.ToAccountIndex)
    console.log("  USDCAmount:", tx_info.USDCAmount)
    console.log("  Nonce:", tx_info.Nonce)

    console.log("Submitting...")

    // const submitResponse = await axios.post(
    //   `${BASE_URL}/api/v1/fastwithdraw`,
    //   new URLSearchParams({
    //     tx_info: JSON.stringify(tx_info),
    //     to_address: ethAddress,
    //   }),
    //   {
    //     headers: {
    //       Authorization: auth_token!,
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //   }
    // )

    // const result = submitResponse.data

    // if (result.code === 200) {
    //   console.log(`✓ Success! TX: ${result.tx_hash}`)
    // } else {
    //   throw new Error(`Failed: ${result.message}`)
    // }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        `Error submitting fast withdraw: ${JSON.stringify(
          error.response?.data
        )}`
      )
    } else {
      console.error(`Error submitting fast withdraw: ${error}`)
    }
  } finally {
    await client.close()
  }
}

fastWithdraw({
  amountUsdc: 50000,
  apiKeyPrivateKey: API_KEY_PRIVATE_KEY,
  ethPrivateKey: ETH_PRIVATE_KEY,
})
