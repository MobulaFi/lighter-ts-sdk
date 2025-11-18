# FundingApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**fundingRates**](#fundingrates) | **GET** /api/v1/funding-rates | funding-rates|

# **fundingRates**
> FundingRates fundingRates()

Get funding rates

### Example

```typescript
import {
    FundingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FundingApi(configuration);

const { status, data } = await apiInstance.fundingRates();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**FundingRates**

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

