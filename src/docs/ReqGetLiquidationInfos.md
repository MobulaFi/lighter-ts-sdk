# ReqGetLiquidationInfos


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **string** |  made optional to support header auth clients | [optional] [default to undefined]
**account_index** | **number** |  | [default to undefined]
**market_id** | **number** |  | [optional] [default to undefined]
**cursor** | **string** |  | [optional] [default to undefined]
**limit** | **number** |  | [default to undefined]

## Example

```typescript
import { ReqGetLiquidationInfos } from './api';

const instance: ReqGetLiquidationInfos = {
    auth,
    account_index,
    market_id,
    cursor,
    limit,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
