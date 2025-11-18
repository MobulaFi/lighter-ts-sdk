# InfoApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**transferFeeInfo**](#transferfeeinfo) | **GET** /api/v1/transferFeeInfo | transferFeeInfo|
|[**withdrawalDelay**](#withdrawaldelay) | **GET** /api/v1/withdrawalDelay | withdrawalDelay|

# **transferFeeInfo**
> TransferFeeInfo transferFeeInfo()

Transfer fee info

### Example

```typescript
import {
    InfoApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InfoApi(configuration);

let accountIndex: number; // (default to undefined)
let authorization: string; // (optional) (default to undefined)
let auth: string; // (optional) (default to undefined)
let toAccountIndex: number; // (optional) (default to -1)

const { status, data } = await apiInstance.transferFeeInfo(
    accountIndex,
    authorization,
    auth,
    toAccountIndex
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **auth** | [**string**] |  | (optional) defaults to undefined|
| **toAccountIndex** | [**number**] |  | (optional) defaults to -1|


### Return type

**TransferFeeInfo**

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

# **withdrawalDelay**
> RespWithdrawalDelay withdrawalDelay()

Withdrawal delay in seconds

### Example

```typescript
import {
    InfoApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InfoApi(configuration);

const { status, data } = await apiInstance.withdrawalDelay();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RespWithdrawalDelay**

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

