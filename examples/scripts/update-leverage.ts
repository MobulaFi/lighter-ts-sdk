import { SignerClient } from "../../src/signer"
import { Configuration, OrderApi, TransactionApi } from "../../src"
import { MAINNET_BASE_URL } from "./constants"

const BASE_URL = MAINNET_BASE_URL
const API_KEY_PRIVATE_KEY = process.env.API_KEY_PRIVATE_KEY
const ACCOUNT_INDEX = process.env.ACCOUNT_INDEX
const API_KEY_INDEX = process.env.API_KEY_INDEX

async function updateLeverage({
  symbol,
  leverage,
  marginMode = SignerClient.ISOLATED_MARGIN_MODE,
}: {
  symbol: string
  leverage: number
  marginMode?: number
}) {
  if (!API_KEY_PRIVATE_KEY || !API_KEY_INDEX || !ACCOUNT_INDEX) {
    console.error("Missing required environment variables")
    process.exit(1)
  }

  const accountIndex = parseInt(ACCOUNT_INDEX)
  const apiKeyIndex = parseInt(API_KEY_INDEX)

  const configuration = new Configuration({
    basePath: BASE_URL,
  })

  const orderInstance = new OrderApi(configuration)
  const transactionInstance = new TransactionApi(configuration)

  const { data } = await orderInstance.orderBooks()
  const market = data.order_books.find((market) => market.symbol === symbol)

  if (!market) {
    console.error(`Market not found for symbol: ${symbol}`)
    process.exit(1)
  }

  const client = new SignerClient(
    BASE_URL,
    API_KEY_PRIVATE_KEY,
    apiKeyIndex,
    accountIndex
  )

  try {
    const { data: nonceData } = await transactionInstance.nextNonce(
      accountIndex,
      apiKeyIndex
    )

    const nonce = nonceData.nonce

    const [txInfo, tx, errMsg] = await client.update_leverage(
      market.market_id,
      marginMode,
      leverage,
      nonce
    )

    if (errMsg) {
      console.error(`Error updating leverage: ${errMsg}`)
      return
    }

    console.log(`Leverage updated successfully to ${leverage}x`)
    if (tx?.tx_hash) {
      console.log(`Transaction hash: ${tx.tx_hash}`)
    }
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await client.close()
  }
}

updateLeverage({
  symbol: "BTC",
  leverage: 2,
  marginMode: SignerClient.CROSS_MARGIN_MODE,
})
