# ReqGetTrades


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **string** |  | [optional] [default to undefined]
**market_id** | **number** |  | [optional] [default to undefined]
**account_index** | **number** |  | [optional] [default to -1]
**order_index** | **number** |  | [optional] [default to undefined]
**sort_by** | **string** |  | [default to undefined]
**sort_dir** | **string** |  | [optional] [default to SortDirEnum_Desc]
**cursor** | **string** |  | [optional] [default to undefined]
**from** | **number** |  | [optional] [default to -1]
**ask_filter** | **number** |  | [optional] [default to undefined]
**limit** | **number** |  | [default to undefined]

## Example

```typescript
import { ReqGetTrades } from './api';

const instance: ReqGetTrades = {
    auth,
    market_id,
    account_index,
    order_index,
    sort_by,
    sort_dir,
    cursor,
    from,
    ask_filter,
    limit,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
