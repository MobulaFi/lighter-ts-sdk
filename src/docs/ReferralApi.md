# ReferralApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**referralKickbackUpdate**](#referralkickbackupdate) | **POST** /api/v1/referral/kickback/update | referral_kickback_update|
|[**referralPoints**](#referralpoints) | **GET** /api/v1/referral/points | referral_points|
|[**referralUpdate**](#referralupdate) | **POST** /api/v1/referral/update | referral_update|

# **referralKickbackUpdate**
> RespUpdateKickback referralKickbackUpdate()

Update kickback percentage for referral rewards

### Example

```typescript
import {
    ReferralApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferralApi(configuration);

let accountIndex: number; // (default to undefined)
let kickbackPercentage: number; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)

const { status, data } = await apiInstance.referralKickbackUpdate(
    accountIndex,
    kickbackPercentage,
    authorization,
    auth
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **kickbackPercentage** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  make required after integ is done | (optional) defaults to undefined|
| **auth** | [**string**] |  made optional to support header auth clients | (optional) defaults to undefined|


### Return type

**RespUpdateKickback**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A successful response. |  -  |
|**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

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

# **referralUpdate**
> RespUpdateReferralCode referralUpdate()

Update referral code (allowed once per account)

### Example

```typescript
import {
    ReferralApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferralApi(configuration);

let accountIndex: number; // (default to undefined)
let newReferralCode: string; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)

const { status, data } = await apiInstance.referralUpdate(
    accountIndex,
    newReferralCode,
    authorization,
    auth
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **newReferralCode** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  make required after integ is done | (optional) defaults to undefined|
| **auth** | [**string**] |  made optional to support header auth clients | (optional) defaults to undefined|


### Return type

**RespUpdateReferralCode**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A successful response. |  -  |
|**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

