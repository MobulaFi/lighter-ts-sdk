# ExchangeStats


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **number** |  | [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**total** | **number** |  | [default to undefined]
**order_book_stats** | [**Array&lt;OrderBookStats&gt;**](OrderBookStats.md) |  | [default to undefined]
**daily_usd_volume** | **number** |  | [default to undefined]
**daily_trades_count** | **number** |  | [default to undefined]

## Example

```typescript
import { ExchangeStats } from './api';

const instance: ExchangeStats = {
    code,
    message,
    total,
    order_book_stats,
    daily_usd_volume,
    daily_trades_count,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
