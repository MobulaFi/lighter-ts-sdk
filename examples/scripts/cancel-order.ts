import { SignerClient } from "../../src/signer"
import { Configuration, OrderApi, TransactionApi, TxByEnum } from "../../src"
import { MAINNET_BASE_URL } from "./constants"
import { getCurrentAuthToken } from "./get-auth-token"

const BASE_URL = MAINNET_BASE_URL
const API_KEY_PRIVATE_KEY = process.env.API_KEY_PRIVATE_KEY
const ACCOUNT_INDEX = process.env.ACCOUNT_INDEX
const API_KEY_INDEX = process.env.API_KEY_INDEX

/**
 * Cancel a limit or stop order
 * @param orderIndex - The order index to cancel (required) - bigint for large order IDs
 * @param marketId - The market ID where the order exists (required)
 */
async function cancelOrder({
  orderIndex,
  marketId,
}: {
  orderIndex: bigint
  marketId: number
}) {
  if (!API_KEY_PRIVATE_KEY || !API_KEY_INDEX || !ACCOUNT_INDEX) {
    console.error(
      "Missing required environment variables: API_KEY_PRIVATE_KEY, API_KEY_INDEX, ACCOUNT_INDEX"
    )
    process.exit(1)
  }

  const accountIndex = parseInt(ACCOUNT_INDEX)
  const apiKeyIndex = parseInt(API_KEY_INDEX)

  const configuration = new Configuration({
    basePath: BASE_URL,
  })

  const transactionInstance = new TransactionApi(configuration)
  const orderInstance = new OrderApi(configuration)

  const client = new SignerClient(
    BASE_URL,
    API_KEY_PRIVATE_KEY,
    apiKeyIndex,
    accountIndex
  )

  try {
    // Get nonce
    const { data: nonceData } = await transactionInstance.nextNonce(
      accountIndex,
      apiKeyIndex
    )
    const nonce = nonceData.nonce

    console.log("Canceling order:")
    console.log("  Order Index:", orderIndex)
    console.log("  Market ID:", marketId)
    console.log("  Account Index:", accountIndex)
    console.log("  API Key Index:", apiKeyIndex)
    console.log("  Nonce:", nonce)

    // Cancel the order
    const [, tx, errMsg] = await client.cancel_order(
      marketId,
      orderIndex,
      nonce,
      apiKeyIndex
    )

    if (errMsg) {
      console.error("Error canceling order:", errMsg)
      return
    }

    if (tx?.tx_hash) {
      console.log("Order cancellation transaction submitted:")
      console.log("  Transaction Hash:", tx.tx_hash)

      // Wait a bit for the transaction to be processed
      await new Promise((resolve) => setTimeout(resolve, 2000))

      try {
        const { data: txData } = await transactionInstance.tx(
          TxByEnum.Hash,
          tx.tx_hash
        )

        if (txData.event_info) {
          const eventInfo =
            typeof txData.event_info === "string"
              ? JSON.parse(txData.event_info)
              : txData.event_info

          // Check for cancel order info in event_info
          // Cancel order responses have the structure: { a: accountId, i: orderIndex, u: clientOrderIndex, ae: appError }
          if (eventInfo.ae && eventInfo.ae !== "") {
            const errorInfo =
              typeof eventInfo.ae === "string"
                ? JSON.parse(eventInfo.ae)
                : eventInfo.ae
            console.error(
              `Order cancellation failed: ${errorInfo.message || eventInfo.ae}`
            )
          } else if (eventInfo.i !== undefined) {
            console.log(
              `Order ${eventInfo.i} canceled successfully | tx hash: ${tx.tx_hash}`
            )
            if (eventInfo.u !== undefined) {
              console.log(`  Client Order Index: ${eventInfo.u}`)
            }
          } else {
            console.log(
              `Order cancellation transaction processed | tx hash: ${tx.tx_hash}`
            )
            console.log("Event info:", JSON.stringify(eventInfo, null, 2))
          }
        } else {
          console.log(
            `Transaction submitted successfully | tx hash: ${tx.tx_hash}`
          )
        }
      } catch (error: any) {
        console.error(
          "Error checking transaction:",
          error.response?.data || error.message
        )
      }
    }
  } catch (error: any) {
    console.error("Error canceling order:", error.message || error)
  } finally {
    await client.close()
  }
}

/**
 * List active orders for an account and market
 * @param accountIndex - The account index
 * @param marketId - The market ID (optional, 255 for all markets)
 */
async function listActiveOrders(accountIndex: number, marketId: number = 255) {
  const configuration = new Configuration({
    basePath: BASE_URL,
  })

  const orderInstance = new OrderApi(configuration)

  const authToken = await getCurrentAuthToken(accountIndex)

  if (!authToken) {
    console.error("No auth token found")
    return
  }

  const { data: ordersData } = await orderInstance.accountActiveOrders(
    accountIndex,
    marketId,
    authToken
  )

  console.log(ordersData)
}

// cancelOrder({ orderIndex: 1n, marketId: 1 })
listActiveOrders(parseInt(ACCOUNT_INDEX!), 1)

export { cancelOrder, listActiveOrders }
