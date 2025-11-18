# BlockApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**block**](#block) | **GET** /api/v1/block | block|
|[**blocks**](#blocks) | **GET** /api/v1/blocks | blocks|
|[**currentHeight**](#currentheight) | **GET** /api/v1/currentHeight | currentHeight|

# **block**
> Blocks block()

Get block by its height or commitment

### Example

```typescript
import {
    BlockApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BlockApi(configuration);

let by: 'commitment' | 'height'; // (default to undefined)
let value: string; // (default to undefined)

const { status, data } = await apiInstance.block(
    by,
    value
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **by** | [**&#39;commitment&#39; | &#39;height&#39;**]**Array<&#39;commitment&#39; &#124; &#39;height&#39;>** |  | defaults to undefined|
| **value** | [**string**] |  | defaults to undefined|


### Return type

**Blocks**

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

# **blocks**
> Blocks blocks()

Get blocks

### Example

```typescript
import {
    BlockApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BlockApi(configuration);

let limit: number; // (default to undefined)
let index: number; // (optional) (default to undefined)
let sort: 'asc' | 'desc'; // (optional) (default to 'asc')

const { status, data } = await apiInstance.blocks(
    limit,
    index,
    sort
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | defaults to undefined|
| **index** | [**number**] |  | (optional) defaults to undefined|
| **sort** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** |  | (optional) defaults to 'asc'|


### Return type

**Blocks**

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

# **currentHeight**
> CurrentHeight currentHeight()

Get current height

### Example

```typescript
import {
    BlockApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BlockApi(configuration);

const { status, data } = await apiInstance.currentHeight();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**CurrentHeight**

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

