# RootApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**info**](#info) | **GET** /info | info|
|[**status**](#status) | **GET** / | status|

# **info**
> ZkLighterInfo info()

Get info of zklighter

### Example

```typescript
import {
    RootApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RootApi(configuration);

const { status, data } = await apiInstance.info();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ZkLighterInfo**

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

# **status**
> Status status()

Get status of zklighter

### Example

```typescript
import {
    RootApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RootApi(configuration);

const { status, data } = await apiInstance.status();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Status**

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

