# AccountApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**account**](#account) | **GET** /api/v1/account | account|
|[**accountLimits**](#accountlimits) | **GET** /api/v1/accountLimits | accountLimits|
|[**accountMetadata**](#accountmetadata) | **GET** /api/v1/accountMetadata | accountMetadata|
|[**accountsByL1Address**](#accountsbyl1address) | **GET** /api/v1/accountsByL1Address | accountsByL1Address|
|[**apikeys**](#apikeys) | **GET** /api/v1/apikeys | apikeys|
|[**changeAccountTier**](#changeaccounttier) | **POST** /api/v1/changeAccountTier | changeAccountTier|
|[**l1Metadata**](#l1metadata) | **GET** /api/v1/l1Metadata | l1Metadata|
|[**liquidations**](#liquidations) | **GET** /api/v1/liquidations | liquidations|
|[**pnl**](#pnl) | **GET** /api/v1/pnl | pnl|
|[**positionFunding**](#positionfunding) | **GET** /api/v1/positionFunding | positionFunding|
|[**publicPools**](#publicpools) | **GET** /api/v1/publicPools | publicPools|
|[**publicPoolsMetadata**](#publicpoolsmetadata) | **GET** /api/v1/publicPoolsMetadata | publicPoolsMetadata|

# **account**
> DetailedAccounts account()

Get account by account\'s index. <br>More details about account index: [Account Index](https://apidocs.lighter.xyz/docs/account-index)<hr>**Response Description:**<br><br>1) **Status:** 1 is active 0 is inactive.<br>2) **Collateral:** The amount of collateral in the account.<hr>**Position Details Description:**<br>1) **OOC:** Open order count in that market.<br>2) **Sign:** 1 for Long, -1 for Short.<br>3) **Position:** The amount of position in that market.<br>4) **Avg Entry Price:** The average entry price of the position.<br>5) **Position Value:** The value of the position.<br>6) **Unrealized PnL:** The unrealized profit and loss of the position.<br>7) **Realized PnL:** The realized profit and loss of the position.

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let by: 'index' | 'l1_address'; // (default to undefined)
let value: string; // (default to undefined)

const { status, data } = await apiInstance.account(
    by,
    value
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **by** | [**&#39;index&#39; | &#39;l1_address&#39;**]**Array<&#39;index&#39; &#124; &#39;l1_address&#39;>** |  | defaults to undefined|
| **value** | [**string**] |  | defaults to undefined|


### Return type

**DetailedAccounts**

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

# **accountLimits**
> AccountLimits accountLimits()

Get account limits

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let accountIndex: number; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)

const { status, data } = await apiInstance.accountLimits(
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

**AccountLimits**

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

# **accountMetadata**
> AccountMetadatas accountMetadata()

Get account metadatas

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let by: 'index' | 'l1_address'; // (default to undefined)
let value: string; // (default to undefined)
let authorization: string; // (optional) (default to undefined)
let auth: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.accountMetadata(
    by,
    value,
    authorization,
    auth
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **by** | [**&#39;index&#39; | &#39;l1_address&#39;**]**Array<&#39;index&#39; &#124; &#39;l1_address&#39;>** |  | defaults to undefined|
| **value** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **auth** | [**string**] |  | (optional) defaults to undefined|


### Return type

**AccountMetadatas**

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

# **accountsByL1Address**
> SubAccounts accountsByL1Address()

Get accounts by l1_address returns all accounts associated with the given L1 address

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let l1Address: string; // (default to undefined)

const { status, data } = await apiInstance.accountsByL1Address(
    l1Address
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **l1Address** | [**string**] |  | defaults to undefined|


### Return type

**SubAccounts**

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

# **apikeys**
> AccountApiKeys apikeys()

Get account api key. Set `api_key_index` to 255 to retrieve all api keys associated with the account.

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let accountIndex: number; // (default to undefined)
let apiKeyIndex: number; // (optional) (default to 255)

const { status, data } = await apiInstance.apikeys(
    accountIndex,
    apiKeyIndex
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **apiKeyIndex** | [**number**] |  | (optional) defaults to 255|


### Return type

**AccountApiKeys**

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

# **changeAccountTier**
> RespChangeAccountTier changeAccountTier()

Change account tier

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let accountIndex: number; // (default to undefined)
let newTier: string; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)

const { status, data } = await apiInstance.changeAccountTier(
    accountIndex,
    newTier,
    authorization,
    auth
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **newTier** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  make required after integ is done | (optional) defaults to undefined|
| **auth** | [**string**] |  made optional to support header auth clients | (optional) defaults to undefined|


### Return type

**RespChangeAccountTier**

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

# **l1Metadata**
> L1Metadata l1Metadata()

Get L1 metadata

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let l1Address: string; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)

const { status, data } = await apiInstance.l1Metadata(
    l1Address,
    authorization,
    auth
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **l1Address** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  make required after integ is done | (optional) defaults to undefined|
| **auth** | [**string**] |  made optional to support header auth clients | (optional) defaults to undefined|


### Return type

**L1Metadata**

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

# **liquidations**
> LiquidationInfos liquidations()

Get liquidation infos

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let accountIndex: number; // (default to undefined)
let limit: number; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)
let marketId: number; // (optional) (default to 255)
let cursor: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.liquidations(
    accountIndex,
    limit,
    authorization,
    auth,
    marketId,
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
| **cursor** | [**string**] |  | (optional) defaults to undefined|


### Return type

**LiquidationInfos**

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

# **pnl**
> AccountPnL pnl()

Get account PnL chart

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let by: 'index'; // (default to undefined)
let value: string; // (default to undefined)
let resolution: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'; // (default to undefined)
let startTimestamp: number; // (default to undefined)
let endTimestamp: number; // (default to undefined)
let countBack: number; // (default to undefined)
let authorization: string; // (optional) (default to undefined)
let auth: string; // (optional) (default to undefined)
let ignoreTransfers: boolean; // (optional) (default to false)

const { status, data } = await apiInstance.pnl(
    by,
    value,
    resolution,
    startTimestamp,
    endTimestamp,
    countBack,
    authorization,
    auth,
    ignoreTransfers
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **by** | [**&#39;index&#39;**]**Array<&#39;index&#39;>** |  | defaults to undefined|
| **value** | [**string**] |  | defaults to undefined|
| **resolution** | [**&#39;1m&#39; | &#39;5m&#39; | &#39;15m&#39; | &#39;1h&#39; | &#39;4h&#39; | &#39;1d&#39;**]**Array<&#39;1m&#39; &#124; &#39;5m&#39; &#124; &#39;15m&#39; &#124; &#39;1h&#39; &#124; &#39;4h&#39; &#124; &#39;1d&#39;>** |  | defaults to undefined|
| **startTimestamp** | [**number**] |  | defaults to undefined|
| **endTimestamp** | [**number**] |  | defaults to undefined|
| **countBack** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **auth** | [**string**] |  | (optional) defaults to undefined|
| **ignoreTransfers** | [**boolean**] |  | (optional) defaults to false|


### Return type

**AccountPnL**

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

# **positionFunding**
> PositionFundings positionFunding()

Get accounts position fundings

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let accountIndex: number; // (default to undefined)
let limit: number; // (default to undefined)
let authorization: string; // (optional) (default to undefined)
let auth: string; // (optional) (default to undefined)
let marketId: number; // (optional) (default to 255)
let cursor: string; // (optional) (default to undefined)
let side: 'long' | 'short' | 'all'; // (optional) (default to 'all')

const { status, data } = await apiInstance.positionFunding(
    accountIndex,
    limit,
    authorization,
    auth,
    marketId,
    cursor,
    side
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **limit** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **auth** | [**string**] |  | (optional) defaults to undefined|
| **marketId** | [**number**] |  | (optional) defaults to 255|
| **cursor** | [**string**] |  | (optional) defaults to undefined|
| **side** | [**&#39;long&#39; | &#39;short&#39; | &#39;all&#39;**]**Array<&#39;long&#39; &#124; &#39;short&#39; &#124; &#39;all&#39;>** |  | (optional) defaults to 'all'|


### Return type

**PositionFundings**

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

# **publicPools**
> PublicPools publicPools()

Get public pools

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let index: number; // (default to undefined)
let limit: number; // (default to undefined)
let authorization: string; // (optional) (default to undefined)
let auth: string; // (optional) (default to undefined)
let filter: 'all' | 'user' | 'protocol' | 'account_index'; // (optional) (default to undefined)
let accountIndex: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.publicPools(
    index,
    limit,
    authorization,
    auth,
    filter,
    accountIndex
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **index** | [**number**] |  | defaults to undefined|
| **limit** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **auth** | [**string**] |  | (optional) defaults to undefined|
| **filter** | [**&#39;all&#39; | &#39;user&#39; | &#39;protocol&#39; | &#39;account_index&#39;**]**Array<&#39;all&#39; &#124; &#39;user&#39; &#124; &#39;protocol&#39; &#124; &#39;account_index&#39;>** |  | (optional) defaults to undefined|
| **accountIndex** | [**number**] |  | (optional) defaults to undefined|


### Return type

**PublicPools**

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

# **publicPoolsMetadata**
> RespPublicPoolsMetadata publicPoolsMetadata()

Get public pools metadata

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let index: number; // (default to undefined)
let limit: number; // (default to undefined)
let authorization: string; // (optional) (default to undefined)
let auth: string; // (optional) (default to undefined)
let filter: 'all' | 'user' | 'protocol' | 'account_index'; // (optional) (default to undefined)
let accountIndex: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.publicPoolsMetadata(
    index,
    limit,
    authorization,
    auth,
    filter,
    accountIndex
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **index** | [**number**] |  | defaults to undefined|
| **limit** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **auth** | [**string**] |  | (optional) defaults to undefined|
| **filter** | [**&#39;all&#39; | &#39;user&#39; | &#39;protocol&#39; | &#39;account_index&#39;**]**Array<&#39;all&#39; &#124; &#39;user&#39; &#124; &#39;protocol&#39; &#124; &#39;account_index&#39;>** |  | (optional) defaults to undefined|
| **accountIndex** | [**number**] |  | (optional) defaults to undefined|


### Return type

**RespPublicPoolsMetadata**

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

