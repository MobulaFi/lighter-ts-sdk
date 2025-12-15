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

/**
 * Maps numeric order status codes to string status names
 * Based on the OrderStatusEnum from the API
 */
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
  maxSlippagePercent = 1.0,
}: {
  symbol: string
  collateralAmountUsd: number
  maxSlippagePercent: number
}) {
  if (!API_KEY_PRIVATE_KEY || !API_KEY_INDEX || !ACCOUNT_INDEX) {
    console.error(
      "API_KEY_PRIVATE_KEY, API_KEY_INDEX, and ACCOUNT_INDEX are required"
    )

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
    console.error(`Market not found for symbol: ${symbol}`)
    process.exit(1)
  }

  // Get market details to understand the base amount multiplier
  const { data: marketDetails } = await orderInstance.orderBookDetails(
    market.market_id
  )
  const marketDetail = marketDetails.order_book_details[0]

  const isAsk = false // false = buy order, true = sell order
  const priceInfo = await getBestPrice(market.market_id, isAsk)
  const priceDecimal = priceInfo.priceDecimal
  const priceFormatted = priceInfo.priceFormatted

  // Calculate base amount based on position size in USD
  // base_amount is in the smallest unit of the base token
  // For SOL, we need to convert USD -> SOL -> base units
  const amountInToken = collateralAmountUsd / priceDecimal

  // The multiplier depends on the market's supported_size_decimals
  // For SOL (market_id: 2), it's 3 decimals, so multiplier is 10^3 = 1000
  // NOT 10000! Using the wrong multiplier causes 10x position size error
  const sizeDecimals = marketDetail.supported_size_decimals || 4
  const BASE_AMOUNT_MULTIPLIER = Math.pow(10, sizeDecimals)
  const baseAmount = Math.round(amountInToken * BASE_AMOUNT_MULTIPLIER)

  // Debug: Calculate expected position value
  const expectedPositionValue =
    (baseAmount / BASE_AMOUNT_MULTIPLIER) * priceDecimal
  console.log(`\n📊 Order Calculation:`)
  console.log(`  Position Size (USD): $${collateralAmountUsd}`)
  console.log(`  Amount in Token: ${amountInToken.toFixed(6)} ${symbol}`)
  console.log(
    `  Base Amount: ${baseAmount} (multiplier: ${BASE_AMOUNT_MULTIPLIER}, decimals: ${sizeDecimals})`
  )
  console.log(
    `  Expected Position Value: ~$${expectedPositionValue.toFixed(2)}`
  )

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
  const maxSlippage = maxSlippagePercent / 100 // Convert percentage to decimal (1% = 0.01)

  console.log(
    `Opening ${symbol} ${
      isAsk ? "sell" : "buy"
    } market order for ${collateralAmountUsd} USD with ${amountInToken.toFixed(
      6
    )} ${symbol} at ~$${priceDecimal} (max slippage: ${maxSlippagePercent}%, nonce: ${nonce})...`
  )

  try {
    // Use create_market_order_limited_slippage to automatically handle slippage
    // This method calculates the acceptable execution price based on the ideal price and max slippage
    const [order, tx, errMsg] =
      await client.create_market_order_limited_slippage(
        market.market_id, // market_index
        clientOrderIndex, // client_order_index
        baseAmount, // base_amount
        maxSlippage, // max_slippage (as decimal, e.g., 0.01 for 1%)
        isAsk, // is_ask
        false, // reduce_only
        nonce,
        apiKeyIndex,
        priceFormatted // ideal_price (optional, will fetch from order book if not provided)
      )

    if (errMsg) {
      console.error(`Error creating order: ${errMsg}`)
      return
    }

    console.log(`Order: ${JSON.stringify(order)}`)
    console.log("Create Order Tx:", tx)

    // Wait a bit for the transaction to be processed
    if (tx?.tx_hash) {
      console.log("\nWaiting 2 seconds for transaction to be processed...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Check transaction status
      try {
        const { data: txData } = await transactionInstance.tx(
          TxByEnum.Hash,
          tx.tx_hash
        )
        console.log("\nTransaction Details:")
        console.log(JSON.stringify(txData, null, 2))

        // Parse event_info to check order status
        if (txData.event_info) {
          const eventInfo =
            typeof txData.event_info === "string"
              ? JSON.parse(txData.event_info)
              : txData.event_info

          if (eventInfo.to) {
            const takerOrder = eventInfo.to
            const statusName = getOrderStatusName(takerOrder.st)
            console.log("\nTaker Order (Your Order) Status:")
            console.log(`  Status (st): ${takerOrder.st} (${statusName})`)
            console.log(`  Filled (f): ${takerOrder.f}`)
            console.log(`  Remaining Size (rs): ${takerOrder.rs}`)
            console.log(`  Order Type (ot): ${takerOrder.ot} (1=market)`)

            // Handle different status codes
            if (takerOrder.st === 8) {
              // canceled-margin-not-allowed
              console.log(
                "\n❌ Order status is 8 - CANCELED due to INSUFFICIENT MARGIN"
              )
              console.log(
                "   Your account doesn't have enough collateral to execute this order."
              )

              // Check account balance
              try {
                const { data: accountData } = await accountInstance.account(
                  AccountByEnum.Index,
                  accountIndex.toString()
                )
                if (accountData.accounts && accountData.accounts.length > 0) {
                  const account = accountData.accounts[0]
                  // Values are already in USDC format (e.g., "4.991915"), not micro-USDC
                  const collateral = parseFloat(account.collateral)
                  const availableBalance = parseFloat(account.available_balance)

                  console.log("\n📊 Account Balance:")
                  console.log(`  Total Collateral: $${collateral.toFixed(2)}`)
                  console.log(
                    `  Available Balance: $${availableBalance.toFixed(2)}`
                  )
                  console.log(
                    `  Order Size: $${collateralAmountUsd.toFixed(2)}`
                  )

                  if (availableBalance < collateralAmountUsd) {
                    console.log(
                      `\n💡 You need at least $${collateralAmountUsd.toFixed(
                        2
                      )} available balance, but you only have $${availableBalance.toFixed(
                        2
                      )}`
                    )
                    console.log(
                      "   Solution: Deposit more collateral or reduce the order size."
                    )
                  } else {
                    console.log(
                      `\n⚠️  You have sufficient balance ($${availableBalance.toFixed(
                        2
                      )}), but the order was still canceled for margin reasons.`
                    )
                    console.log("   This might be due to:")
                    console.log(
                      "   - Margin requirements for the position size"
                    )
                    console.log("   - Existing positions using up margin")
                    console.log("   - Leverage limits or other risk parameters")
                  }
                }
              } catch (error: any) {
                console.error(
                  "Error fetching account balance:",
                  error.response?.data || error.message
                )
              }
            } else if (takerOrder.st === 2) {
              // open
              console.log("\n✅ Order is OPEN and waiting to be filled")
            } else if (takerOrder.st === 3) {
              // filled
              console.log("\n✅ Order is FILLED")
            } else if (takerOrder.st === 0 || takerOrder.st === 1) {
              // in-progress or pending
              console.log(
                `\n⏳ Order is ${statusName.toUpperCase()} - waiting for processing`
              )
            } else if (takerOrder.st >= 4 && takerOrder.st <= 16) {
              // All canceled statuses (4-16)
              console.log(`\n❌ Order was CANCELED: ${statusName}`)
              console.log(
                "   Check inactive orders below for more details about the cancellation."
              )

              // Provide specific guidance for common cancellation reasons
              if (takerOrder.st === 9) {
                console.log(
                  "   💡 Reason: Too much slippage. The execution price would have been worse than your acceptable price."
                )
                console.log(
                  "      Solution: Use a limit order or increase your acceptable slippage."
                )
              } else if (takerOrder.st === 10) {
                console.log(
                  "   💡 Reason: Not enough liquidity in the order book."
                )
                console.log(
                  "      Solution: Try a smaller order size or wait for more liquidity."
                )
              } else if (takerOrder.st === 7) {
                console.log(
                  "   💡 Reason: Position not allowed (e.g., trying to open a position when you already have one in the opposite direction)."
                )
              } else if (takerOrder.st === 16) {
                console.log(
                  "   💡 Reason: Invalid balance. Check your account balance."
                )
              }
            } else if (takerOrder.f > 0) {
              // Partial fill (shouldn't happen with status 0-3, but just in case)
              console.log(
                `\n✅ Order was partially filled (filled: ${takerOrder.f})`
              )
            } else {
              console.log(
                `\n⚠️  Unknown order status: ${takerOrder.st} (${statusName})`
              )
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching transaction:", error.message)
      }

      // Check inactive orders to see if the order appears there
      try {
        const [authToken, authErr] = client.create_auth_token_with_expiry()
        if (authErr) {
          console.error(`Error generating auth token: ${authErr}`)
        } else if (authToken) {
          const { data: inactiveOrders } =
            await orderInstance.accountInactiveOrders(
              accountIndex,
              10, // limit
              undefined, // authorization
              authToken, // auth
              market.market_id, // marketId
              -1, // askFilter (-1 = all)
              undefined, // betweenTimestamps
              undefined // cursor
            )

          console.log("\nRecent Inactive Orders:")
          if (inactiveOrders.orders && inactiveOrders.orders.length > 0) {
            // Find the order that matches our client_order_index
            const ourOrder = inactiveOrders.orders.find(
              (o) => o.client_order_index === clientOrderIndex
            )
            const orderToShow = ourOrder || inactiveOrders.orders[0]

            console.log(
              `  ${ourOrder ? "Your order:" : "Most recent:"} ${
                orderToShow.status
              } - ${orderToShow.type} order`
            )
            console.log(
              `  Client Order Index: ${orderToShow.client_order_index}`
            )
            console.log(
              `  Filled: ${orderToShow.filled_base_amount} / ${orderToShow.initial_base_amount}`
            )
            if (orderToShow.status) {
              console.log(`  Status: ${orderToShow.status}`)
            }

            // Cross-reference with the status code we found
            if (ourOrder && orderToShow.status) {
              console.log(
                `\n  ✓ Status from inactive orders API matches: ${orderToShow.status}`
              )
            }
          } else {
            console.log("  No inactive orders found")
          }
        }
      } catch (error: any) {
        console.error(
          "Error fetching inactive orders:",
          error.response?.data || error.message
        )
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

  // For buy orders (isAsk=false), use asks (sellers)
  // For sell orders (isAsk=true), use bids (buyers)
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
  // Format price by removing decimal point: "139.258" -> 139258
  const priceFormatted = parseInt(bestPriceStr.replace(".", ""))

  return { priceDecimal, priceFormatted }
}

// Create order with 1% max slippage (adjust as needed)
// For more aggressive orders, you can increase slippage (e.g., 2% = 2.0)
createOrder({
  symbol: "SOL",
  collateralAmountUsd: 5,
  maxSlippagePercent: 1.0,
})
