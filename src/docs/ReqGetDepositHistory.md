# ReqGetDepositHistory


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**account_index** | **number** |  | [default to undefined]
**auth** | **string** |  made optional to support header auth clients | [optional] [default to undefined]
**l1_address** | **string** |  | [default to undefined]
**cursor** | **string** |  | [optional] [default to undefined]
**filter** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ReqGetDepositHistory } from './api';

const instance: ReqGetDepositHistory = {
    account_index,
    auth,
    l1_address,
    cursor,
    filter,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
