# ReferralApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**referralPoints**](#referralpoints) | **GET** /api/v1/referral/points | referral_points|

# **referralPoints**
> ReferralPoints referralPoints()

Get referral points

### Example

```typescript
import {
    ReferralApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferralApi(configuration);

let accountIndex: number; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)

const { status, data } = await apiInstance.referralPoints(
    accountIndex,
    authorization,
    auth
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  make required after integ is done | (optional) defaults to undefined|
| **auth** | [**string**] |  made optional to support header auth clients | (optional) defaults to undefined|


### Return type

**ReferralPoints**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A successful response. |  -  |
|**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

