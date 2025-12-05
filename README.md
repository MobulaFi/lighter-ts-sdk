# Lighter SDK

TypeScript SDK for interacting with the Lighter (zkLighter) API. This SDK provides a complete interface for account management, order creation, transaction signing, and more.

## Installation

```bash
npm install zklighter-sdk
```

## Requirements

- Node.js 18+
- TypeScript 5.0+

## Dependencies

- `axios` - HTTP client
- `ethers` - Ethereum library for wallet operations
- `koffi` - FFI bindings for native signer libraries

## Quick Start

### Basic Configuration

```typescript
import { Configuration, AccountApi } from "zklighter-sdk"

const configuration = new Configuration({
  basePath: "https://mainnet.zklighter.elliot.ai", // or testnet URL
})

const accountApi = new AccountApi(configuration)
```

### Get Account Information

```typescript
import { AccountApi, Configuration } from "zklighter-sdk"

const configuration = new Configuration({
  basePath: "https://mainnet.zklighter.elliot.ai",
})

const accountApi = new AccountApi(configuration)

// Get account by L1 address
const response = await accountApi.accountsByL1Address("0x...")
const accountIndex = response.data.sub_accounts[0].index

// Get account details
const accountDetails = await accountApi.account(accountIndex)
console.log(accountDetails.data)
```

### Create an Order

```typescript
import {
  SignerClient,
  Configuration,
  OrderApi,
  TransactionApi,
} from "zklighter-sdk"

const BASE_URL = "https://mainnet.zklighter.elliot.ai"
const API_KEY_PRIVATE_KEY = "your-api-key-private-key"
const API_KEY_INDEX = 0
const ACCOUNT_INDEX = 1

// Initialize the signer client
const client = new SignerClient(
  BASE_URL,
  API_KEY_PRIVATE_KEY,
  API_KEY_INDEX,
  ACCOUNT_INDEX
)

// Get market information
const orderApi = new OrderApi(new Configuration({ basePath: BASE_URL }))
const { data } = await orderApi.orderBooks()
const market = data.order_books.find((m) => m.symbol === "SOL")

// Get current price
const { data: marketData } = await orderApi.orderBookDetails(market.market_id)
const price = marketData.order_book_details[0].last_trade_price

// Get nonce
const txApi = new TransactionApi(new Configuration({ basePath: BASE_URL }))
const { data: nonceData } = await txApi.nextNonce(ACCOUNT_INDEX, API_KEY_INDEX)
const nonce = nonceData.nonce

// Create market order
const [order, tx, errMsg] = await client.create_market_order(
  market.market_id, // market_index
  0, // client_order_index
  4, // base_amount
  price, // avg_execution_price
  false, // is_ask (false = buy, true = sell)
  false, // reduce_only
  nonce,
  API_KEY_INDEX
)

if (errMsg) {
  console.error(`Error: ${errMsg}`)
} else {
  console.log("Order created:", order)
  console.log("Transaction:", tx)
}

// Clean up
await client.close()
```

## API Clients

The SDK provides several API client classes, all auto-generated from the OpenAPI specification:

### AccountApi

Account management operations:

- `account(accountIndex)` - Get account details
- `accountsByL1Address(address)` - Get accounts by Ethereum address
- `accountLimits(accountIndex)` - Get account limits
- `accountMetadata(accountIndex)` - Get account metadata
- `apikeys(accountIndex, apiKeyIndex)` - Get API keys
- `pnl(accountIndex)` - Get profit and loss
- `positionFunding(accountIndex, marketId)` - Get position funding
- And more...

### OrderApi

Order book and trading operations:

- `orderBooks()` - Get all order books
- `orderBookDetails(marketId)` - Get order book details
- `orderBookOrders(marketId)` - Get orders in order book
- `accountActiveOrders(accountIndex)` - Get active orders
- `accountInactiveOrders(accountIndex)` - Get inactive orders
- `recentTrades(marketId)` - Get recent trades
- `trades(...)` - Get trades with filters
- And more...

### TransactionApi

Transaction operations:

- `nextNonce(accountIndex, apiKeyIndex)` - Get next nonce
- `sendTx(tx)` - Send a transaction
- `sendTxBatch(txs)` - Send multiple transactions
- And more...

### CandlestickApi

Market data:

- `candlesticks(marketId, resolution, ...)` - Get candlestick data
- `fundings(marketId)` - Get funding rates

### Other APIs

- `BridgeApi` - Bridge operations
- `FundingApi` - Funding operations
- `InfoApi` - System information
- `NotificationApi` - Notifications
- `ReferralApi` - Referral program
- `RootApi` - Root endpoints (status, info)
- `BlockApi` - Block information
- `AnnouncementApi` - Announcements

## SignerClient

The `SignerClient` is a high-level client that handles transaction signing and submission. It uses native libraries (via koffi) for cryptographic operations.

### Initialization

```typescript
import { SignerClient } from "zklighter-sdk"

const client = new SignerClient(
  baseUrl, // API base URL
  apiKeyPrivateKey, // API key private key (hex string, with or without 0x)
  apiKeyIndex, // API key index
  accountIndex, // Account index
  {
    max_api_key_index: -1, // Optional: max API key index for nonce management
    private_keys: {}, // Optional: additional private keys for multiple API keys
    nonce_management_type: "optimistic", // or 'pessimistic'
  }
)
```

### Order Operations

```typescript
// Create limit order
const [order, tx, err] = await client.create_order(
  marketIndex,
  clientOrderIndex,
  baseAmount,
  price,
  isAsk,
  orderType, // SignerClient.ORDER_TYPE_LIMIT
  timeInForce, // SignerClient.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME
  reduceOnly,
  triggerPrice,
  orderExpiry,
  nonce,
  apiKeyIndex
)

// Create market order
const [order, tx, err] = await client.create_market_order(
  marketIndex,
  clientOrderIndex,
  baseAmount,
  avgExecutionPrice,
  isAsk,
  reduceOnly,
  nonce,
  apiKeyIndex
)

// Create market order with limited slippage
const [order, tx, err] = await client.create_market_order_limited_slippage(
  marketIndex,
  clientOrderIndex,
  baseAmount,
  maxSlippageBps,
  isAsk,
  reduceOnly,
  nonce,
  apiKeyIndex
)

// Cancel order
const [tx, err] = await client.cancel_order(
  marketIndex,
  orderIndex,
  nonce,
  apiKeyIndex
)

// Cancel all orders
const [tx, err] = await client.cancel_all_orders(
  marketIndex,
  cancelAllTif, // SignerClient.CANCEL_ALL_TIF_IMMEDIATE
  nonce,
  apiKeyIndex
)

// Modify order
const [order, tx, err] = await client.modify_order(
  marketIndex,
  orderIndex,
  newPrice,
  newBaseAmount,
  nonce,
  apiKeyIndex
)
```

### Stop Loss and Take Profit Orders

```typescript
// Create take profit order
const [order, tx, err] = await client.create_tp_order(
  marketIndex,
  clientOrderIndex,
  baseAmount,
  triggerPrice,
  price,
  isAsk,
  reduceOnly,
  nonce,
  apiKeyIndex
)

// Create take profit limit order
const [order, tx, err] = await client.create_tp_limit_order(
  marketIndex,
  clientOrderIndex,
  baseAmount,
  triggerPrice,
  price,
  isAsk,
  reduceOnly,
  nonce,
  apiKeyIndex
)

// Create stop loss order
const [order, tx, err] = await client.create_sl_order(
  marketIndex,
  clientOrderIndex,
  baseAmount,
  triggerPrice,
  isAsk,
  reduceOnly,
  nonce,
  apiKeyIndex
)

// Create stop loss limit order
const [order, tx, err] = await client.create_sl_limit_order(
  marketIndex,
  clientOrderIndex,
  baseAmount,
  triggerPrice,
  price,
  isAsk,
  reduceOnly,
  nonce,
  apiKeyIndex
)
```

### Account Operations

```typescript
// Withdraw
const [tx, err] = await client.withdraw(amount, nonce, apiKeyIndex)

// Transfer
const [tx, err] = await client.transfer(
  toAccountIndex,
  amount,
  nonce,
  apiKeyIndex
)

// Create sub-account
const [tx, err] = await client.create_sub_account(nonce, apiKeyIndex)

// Update leverage
const [tx, err] = await client.update_leverage(
  marketIndex,
  leverage,
  nonce,
  apiKeyIndex
)
```

### API Key Management

```typescript
// Change API key
const [tx, err] = await client.change_api_key(ethPrivateKey, newApiPublicKey)

// Create new API key
import { create_api_key } from "zklighter-sdk"

const [privateKey, publicKey, err] = create_api_key("")
if (err) {
  console.error("Error:", err)
} else {
  console.log("Private key:", privateKey)
  console.log("Public key:", publicKey)
}
```

### Authentication

```typescript
// Create auth token
const [authToken, err] = client.create_auth_token_with_expiry()

// Check client (verify API key)
const err = client.check_client()
if (err) {
  console.error("API key verification failed:", err)
}
```

### Nonce Management

The `SignerClient` includes automatic nonce management. You can use `-1` for nonce and `apiKeyIndex` parameters to let the client manage them automatically:

```typescript
// Auto-managed nonce
const [order, tx, err] = await client.create_market_order(
  marketIndex,
  clientOrderIndex,
  baseAmount,
  price,
  isAsk,
  false,
  -1, // nonce: -1 for auto-management
  -1 // apiKeyIndex: -1 for auto-management
)
```

## Constants

### Base URLs

The SDK doesn't export base URLs by default, but you can define them in your project:

```typescript
export const MAINNET_BASE_URL = "https://mainnet.zklighter.elliot.ai"
export const TESTNET_BASE_URL = "https://testnet.zklighter.elliot.ai"
```

Example scripts in the repository use these constants from `examples/scripts/constants.ts`.

### Order Types

```typescript
SignerClient.ORDER_TYPE_LIMIT = 0
SignerClient.ORDER_TYPE_MARKET = 1
SignerClient.ORDER_TYPE_STOP_LOSS = 2
SignerClient.ORDER_TYPE_STOP_LOSS_LIMIT = 3
SignerClient.ORDER_TYPE_TAKE_PROFIT = 4
SignerClient.ORDER_TYPE_TAKE_PROFIT_LIMIT = 5
SignerClient.ORDER_TYPE_TWAP = 6
```

### Time in Force

```typescript
SignerClient.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL = 0
SignerClient.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME = 1
SignerClient.ORDER_TIME_IN_FORCE_POST_ONLY = 2
```

### Transaction Types

```typescript
SignerClient.TX_TYPE_CHANGE_PUB_KEY = 8
SignerClient.TX_TYPE_CREATE_SUB_ACCOUNT = 9
SignerClient.TX_TYPE_CREATE_PUBLIC_POOL = 10
SignerClient.TX_TYPE_UPDATE_PUBLIC_POOL = 11
SignerClient.TX_TYPE_TRANSFER = 12
SignerClient.TX_TYPE_WITHDRAW = 13
SignerClient.TX_TYPE_CREATE_ORDER = 14
SignerClient.TX_TYPE_CANCEL_ORDER = 15
SignerClient.TX_TYPE_CANCEL_ALL_ORDERS = 16
SignerClient.TX_TYPE_MODIFY_ORDER = 17
SignerClient.TX_TYPE_MINT_SHARES = 18
SignerClient.TX_TYPE_BURN_SHARES = 19
SignerClient.TX_TYPE_UPDATE_LEVERAGE = 20
SignerClient.TX_TYPE_CREATE_GROUP_ORDER = 28
```

## Examples

The SDK includes several example scripts in the `examples/scripts/` directory:

- `check-account.ts` - Check account information
- `create-order.ts` - Create a market order
- `generate-api-key.ts` - Generate and register a new API key
- `get-auth-token.ts` - Get authentication token
- `fast-withdraw.ts` - Perform a fast withdrawal
- `get-info.ts` - Get system information
- `positions-interaction.ts` - Position management examples

You can run these examples using the npm scripts defined in `package.json`:

```bash
npm run account
npm run order
npm run key
npm run auth-token
npm run fast-withdraw
npm run info
npm run positions
```

## Error Handling

All API methods return responses in the format:

```typescript
const { status, data } = await apiClient.someMethod()
```

The `SignerClient` methods return tuples:

```typescript
const [result, tx, error] = await client.someMethod()
// or
const [tx, error] = await client.someMethod()
```

Always check for errors:

```typescript
if (error) {
  console.error("Error:", error)
  return
}
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions. All types are exported from the main module:

```typescript
import {
  Configuration,
  AccountApi,
  OrderApi,
  TransactionApi,
  SignerClient,
  // ... other exports
} from "zklighter-sdk"
```

## Native Libraries

The SDK includes native libraries for cryptographic operations:

- `signer-amd64.dll` (Windows)
- `signer-amd64.so` (Linux)
- `signer-arm64.dylib` (macOS ARM)

These are automatically loaded based on your platform.

## Support

For API documentation, see the generated docs in `src/docs/` or visit the Lighter API documentation.
