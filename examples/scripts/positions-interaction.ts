import { SignerClient } from "../../src/signer"
import { Configuration, OrderApi, AccountApi } from "../../src"
import { MAINNET_BASE_URL } from "./constants"

const BASE_URL = MAINNET_BASE_URL
const API_KEY_PRIVATE_KEY = process.env.API_KEY_PRIVATE_KEY
const ACCOUNT_INDEX = process.env.ACCOUNT_INDEX
const API_KEY_INDEX = process.env.API_KEY_INDEX

/**
 * Close a position by creating a market order with reduce_only=true
 * This will close the entire position in the specified market
 */
async function closePosition(
  client: SignerClient,
  marketIndex: number,
  clientOrderIndex: number,
  currentPrice: number,
  isLong: boolean // true for long position, false for short position
): Promise<void> {
  console.log(`Closing position for market ${marketIndex}...`)

  // To close a position, we need to create an order in the opposite direction
  // If position is long (is_ask=false), we close by selling (is_ask=true)
  // If position is short (is_ask=true), we close by buying (is_ask=false)
  const isAsk = isLong // opposite direction to close

  // Use a large base_amount to ensure we close the entire position
  // The system will automatically limit it to the position size
  const baseAmount = 1000000 // Large number, will be capped by position size

  const [order, tx, errMsg] = await client.create_market_order(
    marketIndex,
    clientOrderIndex,
    baseAmount,
    currentPrice,
    isAsk,
    true, // reduce_only = true to close position
    -1, // nonce (auto-managed)
    -1 // api_key_index (auto-managed)
  )

  if (errMsg) {
    console.error(`Error closing position: ${errMsg}`)
    throw new Error(errMsg)
  }

  console.log(`Position closed successfully!`)
  console.log(`Order: ${JSON.stringify(order)}`)
  console.log(`Transaction: ${JSON.stringify(tx)}`)
}

/**
 * Update Take Profit (TP) order
 * This can be done by modifying an existing TP order or creating a new one
 */
async function updateTakeProfit(
  client: SignerClient,
  marketIndex: number,
  orderIndex: number, // existing TP order index to modify, or use -1 to create new
  clientOrderIndex: number,
  newTriggerPrice: number,
  newPrice: number,
  baseAmount: number,
  isAsk: boolean,
  isNewOrder: boolean = false
): Promise<void> {
  console.log(`Updating Take Profit for market ${marketIndex}...`)

  if (isNewOrder || orderIndex === -1) {
    // Create a new TP order
    const [order, tx, errMsg] = await client.create_tp_order(
      marketIndex,
      clientOrderIndex,
      baseAmount,
      newTriggerPrice,
      newPrice,
      isAsk,
      true, // reduce_only
      -1, // nonce
      -1 // api_key_index
    )

    if (errMsg) {
      console.error(`Error creating TP order: ${errMsg}`)
      throw new Error(errMsg)
    }

    console.log(`TP order created successfully!`)
    console.log(`Order: ${JSON.stringify(order)}`)
    console.log(`Transaction: ${JSON.stringify(tx)}`)
  } else {
    // Modify existing TP order
    // Note: modify_order requires base_amount, price, and trigger_price
    // We'll use the new values provided
    const [txInfo, tx, errMsg] = await client.modify_order(
      marketIndex,
      orderIndex,
      baseAmount,
      newPrice,
      newTriggerPrice,
      -1, // nonce
      -1 // api_key_index
    )

    if (errMsg) {
      console.error(`Error modifying TP order: ${errMsg}`)
      throw new Error(errMsg)
    }

    console.log(`TP order modified successfully!`)
    console.log(`Transaction info: ${txInfo}`)
    console.log(`Transaction: ${JSON.stringify(tx)}`)
  }
}

/**
 * Update Stop Loss (SL) order
 * This can be done by modifying an existing SL order or creating a new one
 */
async function updateStopLoss(
  client: SignerClient,
  marketIndex: number,
  orderIndex: number, // existing SL order index to modify, or use -1 to create new
  clientOrderIndex: number,
  newTriggerPrice: number,
  newPrice: number,
  baseAmount: number,
  isAsk: boolean,
  isNewOrder: boolean = false
): Promise<void> {
  console.log(`Updating Stop Loss for market ${marketIndex}...`)

  if (isNewOrder || orderIndex === -1) {
    // Create a new SL order
    const [order, tx, errMsg] = await client.create_sl_order(
      marketIndex,
      clientOrderIndex,
      baseAmount,
      newTriggerPrice,
      newPrice,
      isAsk,
      true, // reduce_only
      -1, // nonce
      -1 // api_key_index
    )

    if (errMsg) {
      console.error(`Error creating SL order: ${errMsg}`)
      throw new Error(errMsg)
    }

    console.log(`SL order created successfully!`)
    console.log(`Order: ${JSON.stringify(order)}`)
    console.log(`Transaction: ${JSON.stringify(tx)}`)
  } else {
    // Modify existing SL order
    const [txInfo, tx, errMsg] = await client.modify_order(
      marketIndex,
      orderIndex,
      baseAmount,
      newPrice,
      newTriggerPrice,
      -1, // nonce
      -1 // api_key_index
    )

    if (errMsg) {
      console.error(`Error modifying SL order: ${errMsg}`)
      throw new Error(errMsg)
    }

    console.log(`SL order modified successfully!`)
    console.log(`Transaction info: ${txInfo}`)
    console.log(`Transaction: ${JSON.stringify(tx)}`)
  }
}

/**
 * Update leverage for a position
 */
async function updateLeverage(
  client: SignerClient,
  marketIndex: number,
  leverage: number, // e.g., 5 for 5x leverage
  marginMode: number = SignerClient.ISOLATED_MARGIN_MODE // 0 = cross, 1 = isolated
): Promise<void> {
  console.log(`Updating leverage for market ${marketIndex} to ${leverage}x...`)

  const [txInfo, tx, errMsg] = await client.update_leverage(
    marketIndex,
    marginMode,
    leverage,
    -1, // nonce
    -1 // api_key_index
  )

  if (errMsg) {
    console.error(`Error updating leverage: ${errMsg}`)
    throw new Error(errMsg)
  }

  console.log(`Leverage updated successfully!`)
  console.log(`Transaction info: ${txInfo}`)
  console.log(`Transaction: ${JSON.stringify(tx)}`)
}

/**
 * Increase position size by creating a new order in the same direction
 */
async function increasePositionSize(
  client: SignerClient,
  marketIndex: number,
  clientOrderIndex: number,
  additionalBaseAmount: number,
  price: number,
  isLong: boolean, // true for long, false for short
  orderType: number = SignerClient.ORDER_TYPE_MARKET
): Promise<void> {
  console.log(
    `Increasing position size for market ${marketIndex} by ${additionalBaseAmount}...`
  )

  // For long position: is_ask = false (buy)
  // For short position: is_ask = true (sell)
  const isAsk = !isLong

  const [order, tx, errMsg] = await client.create_order(
    marketIndex,
    clientOrderIndex,
    additionalBaseAmount,
    price,
    isAsk,
    orderType,
    SignerClient.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
    false, // reduce_only = false to increase position
    SignerClient.NIL_TRIGGER_PRICE,
    SignerClient.DEFAULT_IOC_EXPIRY,
    -1, // nonce
    -1 // api_key_index
  )

  if (errMsg) {
    console.error(`Error increasing position size: ${errMsg}`)
    throw new Error(errMsg)
  }

  console.log(`Position size increased successfully!`)
  console.log(`Order: ${JSON.stringify(order)}`)
  console.log(`Transaction: ${JSON.stringify(tx)}`)
}

/**
 * Decrease position size by creating a reduce-only order
 */
async function decreasePositionSize(
  client: SignerClient,
  marketIndex: number,
  clientOrderIndex: number,
  reduceByBaseAmount: number,
  price: number,
  isLong: boolean, // true for long, false for short
  orderType: number = SignerClient.ORDER_TYPE_MARKET
): Promise<void> {
  console.log(
    `Decreasing position size for market ${marketIndex} by ${reduceByBaseAmount}...`
  )

  // To decrease position, we need to create an order in the opposite direction
  // If position is long (is_ask=false), we reduce by selling (is_ask=true)
  // If position is short (is_ask=true), we reduce by buying (is_ask=false)
  const isAsk = isLong // opposite direction to reduce

  const [order, tx, errMsg] = await client.create_order(
    marketIndex,
    clientOrderIndex,
    reduceByBaseAmount,
    price,
    isAsk,
    orderType,
    SignerClient.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
    true, // reduce_only = true to decrease position
    SignerClient.NIL_TRIGGER_PRICE,
    SignerClient.DEFAULT_IOC_EXPIRY,
    -1, // nonce
    -1 // api_key_index
  )

  if (errMsg) {
    console.error(`Error decreasing position size: ${errMsg}`)
    throw new Error(errMsg)
  }

  console.log(`Position size decreased successfully!`)
  console.log(`Order: ${JSON.stringify(order)}`)
  console.log(`Transaction: ${JSON.stringify(tx)}`)
}

/**
 * Helper function to get account position for a specific market
 */
async function getAccountPosition(
  accountApi: AccountApi,
  accountIndex: number,
  marketIndex: number
): Promise<any> {
  const response = await accountApi.account("index", accountIndex.toString())
  const accounts = response.data.accounts || []
  const account = accounts[0]
  if (!account) {
    return null
  }
  const positions = account.positions || []
  return positions.find((p: any) => p.market_id === marketIndex)
}

/**
 * Example usage of all position interaction methods
 */
async function main() {
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

  const orderApi = new OrderApi(configuration)
  const accountApi = new AccountApi(configuration)

  const client = new SignerClient(
    BASE_URL,
    API_KEY_PRIVATE_KEY,
    apiKeyIndex,
    accountIndex
  )

  try {
    // Example: Get market info
    const symbol = "BTC"
    const { data } = await orderApi.orderBooks()
    const market = data.order_books.find((m) => m.symbol === symbol)

    if (!market) {
      console.error(`Market not found for symbol: ${symbol}`)
      return
    }

    const { data: marketData } = await orderApi.orderBookDetails(
      market.market_id
    )

    const marketDetails = marketData.order_book_details[0]

    const priceMultiplier = Math.pow(10, marketDetails.price_decimals)
    const currentPrice = Math.round(
      marketDetails.last_trade_price * priceMultiplier
    )

    console.log(`Market: ${symbol} (ID: ${market.market_id})`)
    console.log(`Current Price: ${currentPrice}`)

    // Get current position
    const position = await getAccountPosition(
      accountApi,
      accountIndex,
      market.market_id
    )

    if (position) {
      console.log(
        `Current Position: ${position.position} (Sign: ${position.sign})`
      )
    }

    // Example usage (commented out to prevent accidental execution):
    /*
    // 1. Close position
    await closePosition(
      client,
      market.market_id,
      0, // client_order_index
      currentPrice,
      position?.sign === 1 // isLong
    )

    // 2. Update Take Profit
    await updateTakeProfit(
      client,
      market.market_id,
      -1, // order_index (-1 for new order)
      1, // client_order_index
      currentPrice * 1.1, // new trigger price (10% above)
      currentPrice * 1.1, // new price
      100, // base_amount
      position?.sign === 1, // isAsk (opposite of position direction)
      true // isNewOrder
    )

    // 3. Update Stop Loss
    await updateStopLoss(
      client,
      market.market_id,
      -1, // order_index (-1 for new order)
      2, // client_order_index
      currentPrice * 0.95, // new trigger price (5% below)
      currentPrice * 0.95, // new price
      100, // base_amount
      position?.sign === 1, // isAsk (opposite of position direction)
      true // isNewOrder
    )

    // 4. Update leverage
    await updateLeverage(
      client,
      market.market_id,
      5, // leverage (5x)
      SignerClient.ISOLATED_MARGIN_MODE
    )

    // 5. Increase position size
    await increasePositionSize(
      client,
      market.market_id,
      3, // client_order_index
      50, // additional_base_amount
      currentPrice,
      position?.sign === 1, // isLong
      SignerClient.ORDER_TYPE_MARKET
    )

    // 6. Decrease position size
    await decreasePositionSize(
      client,
      market.market_id,
      4, // client_order_index
      25, // reduce_by_base_amount
      currentPrice,
      position?.sign === 1, // isLong
      SignerClient.ORDER_TYPE_MARKET
    )
    */
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await client.close()
  }
}

main()
