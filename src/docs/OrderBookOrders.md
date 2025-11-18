# OrderBookOrders


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **number** |  | [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**total_asks** | **number** |  | [default to undefined]
**asks** | [**Array&lt;SimpleOrder&gt;**](SimpleOrder.md) |  | [default to undefined]
**total_bids** | **number** |  | [default to undefined]
**bids** | [**Array&lt;SimpleOrder&gt;**](SimpleOrder.md) |  | [default to undefined]

## Example

```typescript
import { OrderBookOrders } from './api';

const instance: OrderBookOrders = {
    code,
    message,
    total_asks,
    asks,
    total_bids,
    bids,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
