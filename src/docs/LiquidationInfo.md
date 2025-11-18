# LiquidationInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**positions** | [**Array&lt;AccountPosition&gt;**](AccountPosition.md) |  | [default to undefined]
**risk_info_before** | [**RiskInfo**](RiskInfo.md) |  | [default to undefined]
**risk_info_after** | [**RiskInfo**](RiskInfo.md) |  | [default to undefined]
**mark_prices** | **{ [key: string]: number; }** |  | [default to undefined]

## Example

```typescript
import { LiquidationInfo } from './api';

const instance: LiquidationInfo = {
    positions,
    risk_info_before,
    risk_info_after,
    mark_prices,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
