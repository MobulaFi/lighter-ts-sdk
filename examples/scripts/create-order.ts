import { SignerClient } from "../../src/signer"
import {
  Configuration,
  OrderApi,
  TransactionApi,
  TxByEnum,
  AccountApi,
  AccountByEnum,
} from "../../src"
import { MAINNET_BASE_URL } from "./constants"

const BASE_URL = MAINNET_BASE_URL
const API_KEY_PRIVATE_KEY = process.env.API_KEY_PRIVATE_KEY
const ACCOUNT_INDEX = process.env.ACCOUNT_INDEX
const API_KEY_INDEX = process.env.API_KEY_INDEX

function getOrderStatusName(statusCode: number): string {
  const statusMap: { [key: number]: string } = {
    0: "in-progress",
    1: "pending",
    2: "open",
    3: "filled",
    4: "canceled",
    5: "canceled-post-only",
    6: "canceled-reduce-only",
    7: "canceled-position-not-allowed",
    8: "canceled-margin-not-allowed",
    9: "canceled-too-much-slippage",
    10: "canceled-not-enough-liquidity",
    11: "canceled-self-trade",
    12: "canceled-expired",
    13: "canceled-oco",
    14: "canceled-child",
    15: "canceled-liquidation",
    16: "canceled-invalid-balance",
  }
  return statusMap[statusCode] || `unknown-status-${statusCode}`
}

async function createOrder({
  symbol,
  collateralAmountUsd,
  long,
  maxSlippagePercent = 1.0,
}: {
  symbol: string
  collateralAmountUsd: number
  long: boolean
  maxSlippagePercent: number
}) {
  if (!API_KEY_PRIVATE_KEY || !API_KEY_INDEX || !ACCOUNT_INDEX) {
    process.exit(1)
  }

  const accountIndex = parseInt(ACCOUNT_INDEX)
  const apiKeyIndex = parseInt(API_KEY_INDEX)

  const configuration = new Configuration({
    basePath: BASE_URL,
  })

  const orderInstance = new OrderApi(configuration)
  const transactionInstance = new TransactionApi(configuration)
  const accountInstance = new AccountApi(configuration)

  const { data } = await orderInstance.orderBooks()
  const market = data.order_books.find((market) => market.symbol === symbol)

  if (!market) {
    process.exit(1)
  }

  const { data: marketDetails } = await orderInstance.orderBookDetails(
    market.market_id
  )
  const marketDetail = marketDetails.order_book_details[0]

  const isAsk = long ? false : true
  const priceInfo = await getBestPrice(market.market_id, isAsk)
  const priceDecimal = priceInfo.priceDecimal
  const priceFormatted = priceInfo.priceFormatted

  const amountInToken = collateralAmountUsd / priceDecimal

  const sizeDecimals = marketDetail.supported_size_decimals || 4
  const BASE_AMOUNT_MULTIPLIER = Math.pow(10, sizeDecimals)
  const baseAmount = Math.round(amountInToken * BASE_AMOUNT_MULTIPLIER)

  const client = new SignerClient(
    BASE_URL,
    API_KEY_PRIVATE_KEY,
    apiKeyIndex,
    accountIndex
  )

  const { data: nonceData } = await transactionInstance.nextNonce(
    accountIndex,
    apiKeyIndex
  )

  const nonce = nonceData.nonce
  const clientOrderIndex = Date.now()
  const maxSlippage = maxSlippagePercent / 100

  try {
    const [, tx, errMsg] = await client.create_market_order_limited_slippage(
      market.market_id,
      clientOrderIndex,
      baseAmount,
      maxSlippage,
      isAsk,
      false,
      nonce,
      apiKeyIndex,
      priceFormatted
    )

    if (errMsg) {
      return
    }

    if (tx?.tx_hash) {
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

          if (eventInfo.to) {
            const takerOrder = eventInfo.to
            const statusName = getOrderStatusName(takerOrder.st)

            if (takerOrder.st >= 4 && takerOrder.st <= 16) {
              throw new Error(
                `Order failed: ${statusName} (status code: ${takerOrder.st})`
              )
            } else {
              console.log(
                `Order successful: ${statusName} (status code: ${takerOrder.st})`
              )
              console.log(takerOrder)
            }
          }
        }
      } catch (error: any) {
        console.error(error)
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    await client.close()
  }
}

async function getBestPrice(
  marketId: number,
  isAsk: boolean
): Promise<{ priceDecimal: number; priceFormatted: number }> {
  const configuration = new Configuration({
    basePath: BASE_URL,
  })

  const orderApi = new OrderApi(configuration)
  const { data: orderBookOrders } = await orderApi.orderBookOrders(marketId, 10)

  const side = isAsk ? orderBookOrders.bids : orderBookOrders.asks

  if (!side || side.length === 0) {
    throw new Error(
      `No ${
        isAsk ? "bids" : "asks"
      } available in order book for market ${marketId}`
    )
  }

  const bestPriceStr = side[0].price
  const priceDecimal = parseFloat(bestPriceStr)
  const priceFormatted = parseInt(bestPriceStr.replace(".", ""))

  return { priceDecimal, priceFormatted }
}

createOrder({
  symbol: "MEGA",
  long: true,
  collateralAmountUsd: 10,
  maxSlippagePercent: 1.0,
})
