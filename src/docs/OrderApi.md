# OrderApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**_export**](#_export) | **GET** /api/v1/export | export|
|[**accountActiveOrders**](#accountactiveorders) | **GET** /api/v1/accountActiveOrders | accountActiveOrders|
|[**accountInactiveOrders**](#accountinactiveorders) | **GET** /api/v1/accountInactiveOrders | accountInactiveOrders|
|[**assetDetails**](#assetdetails) | **GET** /api/v1/assetDetails | assetDetails|
|[**exchangeStats**](#exchangestats) | **GET** /api/v1/exchangeStats | exchangeStats|
|[**orderBookDetails**](#orderbookdetails) | **GET** /api/v1/orderBookDetails | orderBookDetails|
|[**orderBookOrders**](#orderbookorders) | **GET** /api/v1/orderBookOrders | orderBookOrders|
|[**orderBooks**](#orderbooks) | **GET** /api/v1/orderBooks | orderBooks|
|[**recentTrades**](#recenttrades) | **GET** /api/v1/recentTrades | recentTrades|
|[**trades**](#trades) | **GET** /api/v1/trades | trades|

# **_export**
> ExportData _export()

Export data

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let type: 'funding' | 'trade'; // (default to undefined)
let authorization: string; // (optional) (default to undefined)
let auth: string; // (optional) (default to undefined)
let accountIndex: number; // (optional) (default to -1)
let marketId: number; // (optional) (default to 255)

const { status, data } = await apiInstance._export(
    type,
    authorization,
    auth,
    accountIndex,
    marketId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **type** | [**&#39;funding&#39; | &#39;trade&#39;**]**Array<&#39;funding&#39; &#124; &#39;trade&#39;>** |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **auth** | [**string**] |  | (optional) defaults to undefined|
| **accountIndex** | [**number**] |  | (optional) defaults to -1|
| **marketId** | [**number**] |  | (optional) defaults to 255|


### Return type

**ExportData**

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

# **accountActiveOrders**
> Orders accountActiveOrders()

Get account active orders. `auth` can be generated using the SDK.

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let accountIndex: number; // (default to undefined)
let marketId: number; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)

const { status, data } = await apiInstance.accountActiveOrders(
    accountIndex,
    marketId,
    authorization,
    auth
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **marketId** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  make required after integ is done | (optional) defaults to undefined|
| **auth** | [**string**] |  made optional to support header auth clients | (optional) defaults to undefined|


### Return type

**Orders**

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

# **accountInactiveOrders**
> Orders accountInactiveOrders()

Get account inactive orders

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let accountIndex: number; // (default to undefined)
let limit: number; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)
let marketId: number; // (optional) (default to 255)
let askFilter: number; // (optional) (default to -1)
let betweenTimestamps: string; // (optional) (default to undefined)
let cursor: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.accountInactiveOrders(
    accountIndex,
    limit,
    authorization,
    auth,
    marketId,
    askFilter,
    betweenTimestamps,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **limit** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  make required after integ is done | (optional) defaults to undefined|
| **auth** | [**string**] |  made optional to support header auth clients | (optional) defaults to undefined|
| **marketId** | [**number**] |  | (optional) defaults to 255|
| **askFilter** | [**number**] |  | (optional) defaults to -1|
| **betweenTimestamps** | [**string**] |  | (optional) defaults to undefined|
| **cursor** | [**string**] |  | (optional) defaults to undefined|


### Return type

**Orders**

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

# **assetDetails**
> AssetDetails assetDetails()

Get asset details

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let assetId: number; // (optional) (default to 0)

const { status, data } = await apiInstance.assetDetails(
    assetId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assetId** | [**number**] |  | (optional) defaults to 0|


### Return type

**AssetDetails**

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

# **exchangeStats**
> ExchangeStats exchangeStats()

Get exchange stats

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

const { status, data } = await apiInstance.exchangeStats();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ExchangeStats**

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

# **orderBookDetails**
> OrderBookDetails orderBookDetails()

Get order books metadata

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let marketId: number; // (optional) (default to 255)
let filter: 'all' | 'spot' | 'perp'; // (optional) (default to 'all')

const { status, data } = await apiInstance.orderBookDetails(
    marketId,
    filter
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **marketId** | [**number**] |  | (optional) defaults to 255|
| **filter** | [**&#39;all&#39; | &#39;spot&#39; | &#39;perp&#39;**]**Array<&#39;all&#39; &#124; &#39;spot&#39; &#124; &#39;perp&#39;>** |  | (optional) defaults to 'all'|


### Return type

**OrderBookDetails**

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

# **orderBookOrders**
> OrderBookOrders orderBookOrders()

Get order book orders

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let marketId: number; // (default to undefined)
let limit: number; // (default to undefined)

const { status, data } = await apiInstance.orderBookOrders(
    marketId,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **marketId** | [**number**] |  | defaults to undefined|
| **limit** | [**number**] |  | defaults to undefined|


### Return type

**OrderBookOrders**

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

# **orderBooks**
> OrderBooks orderBooks()

Get order books metadata.<hr>**Response Description:**<br><br>1) **Taker and maker fees** are in percentage.<br>2) **Min base amount:** The amount of base token that can be traded in a single order.<br>3) **Min quote amount:** The amount of quote token that can be traded in a single order.<br>4) **Supported size decimals:** The number of decimal places that can be used for the size of the order.<br>5) **Supported price decimals:** The number of decimal places that can be used for the price of the order.<br>6) **Supported quote decimals:** Size Decimals + Quote Decimals.

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let marketId: number; // (optional) (default to 255)
let filter: 'all' | 'spot' | 'perp'; // (optional) (default to 'all')

const { status, data } = await apiInstance.orderBooks(
    marketId,
    filter
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **marketId** | [**number**] |  | (optional) defaults to 255|
| **filter** | [**&#39;all&#39; | &#39;spot&#39; | &#39;perp&#39;**]**Array<&#39;all&#39; &#124; &#39;spot&#39; &#124; &#39;perp&#39;>** |  | (optional) defaults to 'all'|


### Return type

**OrderBooks**

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

# **recentTrades**
> Trades recentTrades()

Get recent trades

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let marketId: number; // (default to undefined)
let limit: number; // (default to undefined)

const { status, data } = await apiInstance.recentTrades(
    marketId,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **marketId** | [**number**] |  | defaults to undefined|
| **limit** | [**number**] |  | defaults to undefined|


### Return type

**Trades**

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

# **trades**
> Trades trades()

Get trades

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let sortBy: 'block_height' | 'timestamp' | 'trade_id'; // (default to undefined)
let limit: number; // (default to undefined)
let authorization: string; // (optional) (default to undefined)
let auth: string; // (optional) (default to undefined)
let marketId: number; // (optional) (default to 255)
let accountIndex: number; // (optional) (default to -1)
let orderIndex: number; // (optional) (default to undefined)
let sortDir: 'desc'; // (optional) (default to 'desc')
let cursor: string; // (optional) (default to undefined)
let from: number; // (optional) (default to -1)
let askFilter: number; // (optional) (default to -1)
let role: 'all' | 'maker' | 'taker'; // (optional) (default to 'all')
let type: 'all' | 'trade' | 'liquidation' | 'deleverage' | 'market-settlement'; // (optional) (default to 'all')
let aggregate: boolean; // (optional) (default to false)

const { status, data } = await apiInstance.trades(
    sortBy,
    limit,
    authorization,
    auth,
    marketId,
    accountIndex,
    orderIndex,
    sortDir,
    cursor,
    from,
    askFilter,
    role,
    type,
    aggregate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sortBy** | [**&#39;block_height&#39; | &#39;timestamp&#39; | &#39;trade_id&#39;**]**Array<&#39;block_height&#39; &#124; &#39;timestamp&#39; &#124; &#39;trade_id&#39;>** |  | defaults to undefined|
| **limit** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **auth** | [**string**] |  | (optional) defaults to undefined|
| **marketId** | [**number**] |  | (optional) defaults to 255|
| **accountIndex** | [**number**] |  | (optional) defaults to -1|
| **orderIndex** | [**number**] |  | (optional) defaults to undefined|
| **sortDir** | [**&#39;desc&#39;**]**Array<&#39;desc&#39;>** |  | (optional) defaults to 'desc'|
| **cursor** | [**string**] |  | (optional) defaults to undefined|
| **from** | [**number**] |  | (optional) defaults to -1|
| **askFilter** | [**number**] |  | (optional) defaults to -1|
| **role** | [**&#39;all&#39; | &#39;maker&#39; | &#39;taker&#39;**]**Array<&#39;all&#39; &#124; &#39;maker&#39; &#124; &#39;taker&#39;>** |  | (optional) defaults to 'all'|
| **type** | [**&#39;all&#39; | &#39;trade&#39; | &#39;liquidation&#39; | &#39;deleverage&#39; | &#39;market-settlement&#39;**]**Array<&#39;all&#39; &#124; &#39;trade&#39; &#124; &#39;liquidation&#39; &#124; &#39;deleverage&#39; &#124; &#39;market-settlement&#39;>** |  | (optional) defaults to 'all'|
| **aggregate** | [**boolean**] |  | (optional) defaults to false|


### Return type

**Trades**

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

