import { SignerClient } from "../../src/signer"
import { Configuration, AccountApi } from "../../src"
import { MAINNET_BASE_URL } from "./constants"

const AMOUNT = 5.0

const BASE_URL = MAINNET_BASE_URL
const API_KEY_PRIVATE_KEY = process.env.API_KEY_PRIVATE_KEY
const API_KEY_INDEX = process.env.API_KEY_INDEX
const ACCOUNT_INDEX = process.env.ACCOUNT_INDEX

async function main() {
  if (!API_KEY_PRIVATE_KEY || !API_KEY_INDEX || !ACCOUNT_INDEX) {
    console.error(
      "API_KEY_PRIVATE_KEY, API_KEY_INDEX, and ACCOUNT_INDEX are required"
    )
    process.exit(1)
  }

  const accountIndex = parseInt(ACCOUNT_INDEX)
  const apiKeyIndex = parseInt(API_KEY_INDEX)

  const client = new SignerClient(
    BASE_URL,
    API_KEY_PRIVATE_KEY,
    apiKeyIndex,
    accountIndex
  )

  const [withdraw_tx, response, err] = await client.withdraw(
    SignerClient.ASSET_ID_USDC, // change this to `SignerClient.ASSET_ID_ETH` to withdraw ETH. Also, change route_type to spot
    SignerClient.ROUTE_PERP, // change this to `SignerClient.ROUTE_SPOT` to withdraw from spot balance
    AMOUNT
  )

  if (err !== null) {
    throw new Error(`error withdrawing ${err}`)
  }

  console.log(withdraw_tx, response)

  await client.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
