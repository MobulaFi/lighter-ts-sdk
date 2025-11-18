# ReqGetAccountInactiveOrders


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **string** |  made optional to support header auth clients | [optional] [default to undefined]
**account_index** | **number** |  | [default to undefined]
**market_id** | **number** |  | [optional] [default to undefined]
**ask_filter** | **number** |  | [optional] [default to undefined]
**between_timestamps** | **string** |  | [optional] [default to undefined]
**cursor** | **string** |  | [optional] [default to undefined]
**limit** | **number** |  | [default to undefined]

## Example

```typescript
import { ReqGetAccountInactiveOrders } from './api';

const instance: ReqGetAccountInactiveOrders = {
    auth,
    account_index,
    market_id,
    ask_filter,
    between_timestamps,
    cursor,
    limit,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
