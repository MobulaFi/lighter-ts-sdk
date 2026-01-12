# OrderBookDetails


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **number** |  | [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**order_book_details** | [**Array&lt;PerpsOrderBookDetail&gt;**](PerpsOrderBookDetail.md) |  | [default to undefined]
**spot_order_book_details** | [**Array&lt;SpotOrderBookDetail&gt;**](SpotOrderBookDetail.md) |  | [default to undefined]

## Example

```typescript
import { OrderBookDetails } from './api';

const instance: OrderBookDetails = {
    code,
    message,
    order_book_details,
    spot_order_book_details,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
