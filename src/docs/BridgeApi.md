# BridgeApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**fastbridgeInfo**](#fastbridgeinfo) | **GET** /api/v1/fastbridge/info | fastbridge_info|

# **fastbridgeInfo**
> RespGetFastBridgeInfo fastbridgeInfo()

Get fast bridge info

### Example

```typescript
import {
    BridgeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BridgeApi(configuration);

const { status, data } = await apiInstance.fastbridgeInfo();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RespGetFastBridgeInfo**

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

