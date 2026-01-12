import { Configuration, OrderApi, SignerClient } from "../../src"
import { MAINNET_BASE_URL } from "./constants"

async function getMarketDetails(symbol: string): Promise<any> {
  const configuration = new Configuration({
    basePath: MAINNET_BASE_URL,
  })

  const marketClient = new OrderApi(configuration)

  try {
    const { data } = await marketClient.orderBooks()
    const market = data.order_books.find((market) => market.symbol === symbol)

    if (!market) {
      console.error(`Market not found for symbol: ${symbol}`)
      process.exit(1)
    }

    const response = await marketClient.orderBookDetails(market.market_id)
    const marketDetails = response.data.order_book_details[0]
    const marketDefaultMarginMode =
      marketDetails.market_config.market_margin_mode

    console.log(
      `${symbol} default margin mode is ${
        marketDefaultMarginMode === SignerClient.ISOLATED_MARGIN_MODE
          ? "isolated"
          : "cross"
      }`
    )
  } catch (error: any) {
    throw new Error(error.message)
  }
}

getMarketDetails("AAPL").catch((error) => {
  console.error(error)
})
