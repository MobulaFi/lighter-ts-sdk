# PublicPoolInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **number** |  | [default to undefined]
**operator_fee** | **string** |  | [default to undefined]
**min_operator_share_rate** | **string** |  | [default to undefined]
**total_shares** | **number** |  | [default to undefined]
**operator_shares** | **number** |  | [default to undefined]
**annual_percentage_yield** | **number** |  | [default to undefined]
**sharpe_ratio** | **number** |  | [default to undefined]
**daily_returns** | [**Array&lt;DailyReturn&gt;**](DailyReturn.md) |  | [default to undefined]
**share_prices** | [**Array&lt;SharePrice&gt;**](SharePrice.md) |  | [default to undefined]

## Example

```typescript
import { PublicPoolInfo } from './api';

const instance: PublicPoolInfo = {
    status,
    operator_fee,
    min_operator_share_rate,
    total_shares,
    operator_shares,
    annual_percentage_yield,
    sharpe_ratio,
    daily_returns,
    share_prices,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
