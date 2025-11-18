# TransactionApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**accountTxs**](#accounttxs) | **GET** /api/v1/accountTxs | accountTxs|
|[**blockTxs**](#blocktxs) | **GET** /api/v1/blockTxs | blockTxs|
|[**depositHistory**](#deposithistory) | **GET** /api/v1/deposit/history | deposit_history|
|[**nextNonce**](#nextnonce) | **GET** /api/v1/nextNonce | nextNonce|
|[**sendTx**](#sendtx) | **POST** /api/v1/sendTx | sendTx|
|[**sendTxBatch**](#sendtxbatch) | **POST** /api/v1/sendTxBatch | sendTxBatch|
|[**transferHistory**](#transferhistory) | **GET** /api/v1/transfer/history | transfer_history|
|[**tx**](#tx) | **GET** /api/v1/tx | tx|
|[**txFromL1TxHash**](#txfroml1txhash) | **GET** /api/v1/txFromL1TxHash | txFromL1TxHash|
|[**txs**](#txs) | **GET** /api/v1/txs | txs|
|[**withdrawHistory**](#withdrawhistory) | **GET** /api/v1/withdraw/history | withdraw_history|

# **accountTxs**
> Txs accountTxs()

Get transactions of a specific account

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let limit: number; // (default to undefined)
let by: 'account_index'; // (default to undefined)
let value: string; // (default to undefined)
let authorization: string; // (optional) (default to undefined)
let index: number; // (optional) (default to undefined)
let types: Array<number>; // (optional) (default to undefined)
let auth: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.accountTxs(
    limit,
    by,
    value,
    authorization,
    index,
    types,
    auth
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | defaults to undefined|
| **by** | [**&#39;account_index&#39;**]**Array<&#39;account_index&#39;>** |  | defaults to undefined|
| **value** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **index** | [**number**] |  | (optional) defaults to undefined|
| **types** | **Array&lt;number&gt;** |  | (optional) defaults to undefined|
| **auth** | [**string**] |  | (optional) defaults to undefined|


### Return type

**Txs**

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

# **blockTxs**
> Txs blockTxs()

Get transactions in a block

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let by: 'block_height' | 'block_commitment'; // (default to undefined)
let value: string; // (default to undefined)

const { status, data } = await apiInstance.blockTxs(
    by,
    value
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **by** | [**&#39;block_height&#39; | &#39;block_commitment&#39;**]**Array<&#39;block_height&#39; &#124; &#39;block_commitment&#39;>** |  | defaults to undefined|
| **value** | [**string**] |  | defaults to undefined|


### Return type

**Txs**

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

# **depositHistory**
> DepositHistory depositHistory()

Get deposit history

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let accountIndex: number; // (default to undefined)
let l1Address: string; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)
let cursor: string; // (optional) (default to undefined)
let filter: 'all' | 'pending' | 'claimable'; // (optional) (default to undefined)

const { status, data } = await apiInstance.depositHistory(
    accountIndex,
    l1Address,
    authorization,
    auth,
    cursor,
    filter
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **l1Address** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  make required after integ is done | (optional) defaults to undefined|
| **auth** | [**string**] |  made optional to support header auth clients | (optional) defaults to undefined|
| **cursor** | [**string**] |  | (optional) defaults to undefined|
| **filter** | [**&#39;all&#39; | &#39;pending&#39; | &#39;claimable&#39;**]**Array<&#39;all&#39; &#124; &#39;pending&#39; &#124; &#39;claimable&#39;>** |  | (optional) defaults to undefined|


### Return type

**DepositHistory**

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

# **nextNonce**
> NextNonce nextNonce()

Get next nonce for a specific account and api key

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let accountIndex: number; // (default to undefined)
let apiKeyIndex: number; // (default to undefined)

const { status, data } = await apiInstance.nextNonce(
    accountIndex,
    apiKeyIndex
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **apiKeyIndex** | [**number**] |  | defaults to undefined|


### Return type

**NextNonce**

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

# **sendTx**
> RespSendTx sendTx()

You need to sign the transaction body before sending it to the server. More details can be found in the Get Started docs: [Get Started For Programmers](https://apidocs.lighter.xyz/docs/get-started-for-programmers)

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let txType: number; // (default to undefined)
let txInfo: string; // (default to undefined)
let priceProtection: boolean; // (optional) (default to true)

const { status, data } = await apiInstance.sendTx(
    txType,
    txInfo,
    priceProtection
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **txType** | [**number**] |  | defaults to undefined|
| **txInfo** | [**string**] |  | defaults to undefined|
| **priceProtection** | [**boolean**] |  | (optional) defaults to true|


### Return type

**RespSendTx**

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

# **sendTxBatch**
> RespSendTxBatch sendTxBatch()

You need to sign the transaction body before sending it to the server. More details can be found in the Get Started docs: [Get Started For Programmers](https://apidocs.lighter.xyz/docs/get-started-for-programmers)

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let txTypes: string; // (default to undefined)
let txInfos: string; // (default to undefined)

const { status, data } = await apiInstance.sendTxBatch(
    txTypes,
    txInfos
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **txTypes** | [**string**] |  | defaults to undefined|
| **txInfos** | [**string**] |  | defaults to undefined|


### Return type

**RespSendTxBatch**

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

# **transferHistory**
> TransferHistory transferHistory()

Get transfer history

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let accountIndex: number; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)
let cursor: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.transferHistory(
    accountIndex,
    authorization,
    auth,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  make required after integ is done | (optional) defaults to undefined|
| **auth** | [**string**] |  made optional to support header auth clients | (optional) defaults to undefined|
| **cursor** | [**string**] |  | (optional) defaults to undefined|


### Return type

**TransferHistory**

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

# **tx**
> EnrichedTx tx()

Get transaction by hash or sequence index

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let by: 'hash' | 'sequence_index'; // (default to undefined)
let value: string; // (default to undefined)

const { status, data } = await apiInstance.tx(
    by,
    value
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **by** | [**&#39;hash&#39; | &#39;sequence_index&#39;**]**Array<&#39;hash&#39; &#124; &#39;sequence_index&#39;>** |  | defaults to undefined|
| **value** | [**string**] |  | defaults to undefined|


### Return type

**EnrichedTx**

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

# **txFromL1TxHash**
> EnrichedTx txFromL1TxHash()

Get L1 transaction by L1 transaction hash

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let hash: string; // (default to undefined)

const { status, data } = await apiInstance.txFromL1TxHash(
    hash
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hash** | [**string**] |  | defaults to undefined|


### Return type

**EnrichedTx**

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

# **txs**
> Txs txs()

Get transactions which are already packed into blocks

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let limit: number; // (default to undefined)
let index: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.txs(
    limit,
    index
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | defaults to undefined|
| **index** | [**number**] |  | (optional) defaults to undefined|


### Return type

**Txs**

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

# **withdrawHistory**
> WithdrawHistory withdrawHistory()

Get withdraw history

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let accountIndex: number; // (default to undefined)
let authorization: string; // make required after integ is done (optional) (default to undefined)
let auth: string; // made optional to support header auth clients (optional) (default to undefined)
let cursor: string; // (optional) (default to undefined)
let filter: 'all' | 'pending' | 'claimable'; // (optional) (default to undefined)

const { status, data } = await apiInstance.withdrawHistory(
    accountIndex,
    authorization,
    auth,
    cursor,
    filter
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountIndex** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  make required after integ is done | (optional) defaults to undefined|
| **auth** | [**string**] |  made optional to support header auth clients | (optional) defaults to undefined|
| **cursor** | [**string**] |  | (optional) defaults to undefined|
| **filter** | [**&#39;all&#39; | &#39;pending&#39; | &#39;claimable&#39;**]**Array<&#39;all&#39; &#124; &#39;pending&#39; &#124; &#39;claimable&#39;>** |  | (optional) defaults to undefined|


### Return type

**WithdrawHistory**

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

