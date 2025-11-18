# CandlestickApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**candlesticks**](#candlesticks) | **GET** /api/v1/candlesticks | candlesticks|
|[**fundings**](#fundings) | **GET** /api/v1/fundings | fundings|

# **candlesticks**
> Candlesticks candlesticks()

Get candlesticks

### Example

```typescript
import {
    CandlestickApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CandlestickApi(configuration);

let marketId: number; // (default to undefined)
let resolution: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'; // (default to undefined)
let startTimestamp: number; // (default to undefined)
let endTimestamp: number; // (default to undefined)
let countBack: number; // (default to undefined)
let setTimestampToEnd: boolean; // (optional) (default to false)

const { status, data } = await apiInstance.candlesticks(
    marketId,
    resolution,
    startTimestamp,
    endTimestamp,
    countBack,
    setTimestampToEnd
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **marketId** | [**number**] |  | defaults to undefined|
| **resolution** | [**&#39;1m&#39; | &#39;5m&#39; | &#39;15m&#39; | &#39;1h&#39; | &#39;4h&#39; | &#39;1d&#39;**]**Array<&#39;1m&#39; &#124; &#39;5m&#39; &#124; &#39;15m&#39; &#124; &#39;1h&#39; &#124; &#39;4h&#39; &#124; &#39;1d&#39;>** |  | defaults to undefined|
| **startTimestamp** | [**number**] |  | defaults to undefined|
| **endTimestamp** | [**number**] |  | defaults to undefined|
| **countBack** | [**number**] |  | defaults to undefined|
| **setTimestampToEnd** | [**boolean**] |  | (optional) defaults to false|


### Return type

**Candlesticks**

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

# **fundings**
> Fundings fundings()

Get fundings

### Example

```typescript
import {
    CandlestickApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CandlestickApi(configuration);

let marketId: number; // (default to undefined)
let resolution: '1h' | '1d'; // (default to undefined)
let startTimestamp: number; // (default to undefined)
let endTimestamp: number; // (default to undefined)
let countBack: number; // (default to undefined)

const { status, data } = await apiInstance.fundings(
    marketId,
    resolution,
    startTimestamp,
    endTimestamp,
    countBack
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **marketId** | [**number**] |  | defaults to undefined|
| **resolution** | [**&#39;1h&#39; | &#39;1d&#39;**]**Array<&#39;1h&#39; &#124; &#39;1d&#39;>** |  | defaults to undefined|
| **startTimestamp** | [**number**] |  | defaults to undefined|
| **endTimestamp** | [**number**] |  | defaults to undefined|
| **countBack** | [**number**] |  | defaults to undefined|


### Return type

**Fundings**

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

