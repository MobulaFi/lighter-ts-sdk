# AnnouncementApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**announcement**](#announcement) | **GET** /api/v1/announcement | announcement|

# **announcement**
> Announcements announcement()

Get announcement

### Example

```typescript
import {
    AnnouncementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnnouncementApi(configuration);

const { status, data } = await apiInstance.announcement();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Announcements**

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

