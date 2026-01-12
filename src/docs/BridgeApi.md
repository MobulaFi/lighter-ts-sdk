# BridgeApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**bridges**](#bridges) | **GET** /api/v1/bridges | bridges|
|[**bridgesIsNextBridgeFast**](#bridgesisnextbridgefast) | **GET** /api/v1/bridges/isNextBridgeFast | bridges_isNextBridgeFast|
|[**fastbridgeInfo**](#fastbridgeinfo) | **GET** /api/v1/fastbridge/info | fastbridge_info|

# **bridges**
> RespGetBridgesByL1Addr bridges()

Get bridges for given l1 address

### Example

```typescript
import {
    BridgeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BridgeApi(configuration);

let l1Address: string; // (default to undefined)

const { status, data } = await apiInstance.bridges(
    l1Address
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **l1Address** | [**string**] |  | defaults to undefined|


### Return type

**RespGetBridgesByL1Addr**

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

# **bridgesIsNextBridgeFast**
> RespGetIsNextBridgeFast bridgesIsNextBridgeFast()

Get if next bridge is fast

### Example

```typescript
import {
    BridgeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BridgeApi(configuration);

let l1Address: string; // (default to undefined)

const { status, data } = await apiInstance.bridgesIsNextBridgeFast(
    l1Address
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **l1Address** | [**string**] |  | defaults to undefined|


### Return type

**RespGetIsNextBridgeFast**

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

