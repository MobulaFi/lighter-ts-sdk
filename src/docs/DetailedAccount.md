# DetailedAccount


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **number** |  | [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**account_type** | **number** |  | [default to undefined]
**index** | **number** |  | [default to undefined]
**l1_address** | **string** |  | [default to undefined]
**cancel_all_time** | **number** |  | [default to undefined]
**total_order_count** | **number** |  | [default to undefined]
**pending_order_count** | **number** |  | [default to undefined]
**available_balance** | **string** |  | [default to undefined]
**status** | **number** |  | [default to undefined]
**collateral** | **string** |  | [default to undefined]
**account_index** | **number** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**can_invite** | **boolean** |  Remove After FE uses L1 meta endpoint | [default to undefined]
**referral_points_percentage** | **string** |  Remove After FE uses L1 meta endpoint | [default to undefined]
**positions** | [**Array&lt;AccountPosition&gt;**](AccountPosition.md) |  | [default to undefined]
**assets** | [**Array&lt;AccountAsset&gt;**](AccountAsset.md) |  | [default to undefined]
**total_asset_value** | **string** |  | [default to undefined]
**cross_asset_value** | **string** |  | [default to undefined]
**pool_info** | [**PublicPoolInfo**](PublicPoolInfo.md) |  | [default to undefined]
**shares** | [**Array&lt;PublicPoolShare&gt;**](PublicPoolShare.md) |  | [default to undefined]

## Example

```typescript
import { DetailedAccount } from './api';

const instance: DetailedAccount = {
    code,
    message,
    account_type,
    index,
    l1_address,
    cancel_all_time,
    total_order_count,
    pending_order_count,
    available_balance,
    status,
    collateral,
    account_index,
    name,
    description,
    can_invite,
    referral_points_percentage,
    positions,
    assets,
    total_asset_value,
    cross_asset_value,
    pool_info,
    shares,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
