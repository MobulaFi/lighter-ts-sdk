# Order


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**order_index** | **number** |  | [default to undefined]
**client_order_index** | **number** |  | [default to undefined]
**order_id** | **string** |  | [default to undefined]
**client_order_id** | **string** |  | [default to undefined]
**market_index** | **number** |  | [default to undefined]
**owner_account_index** | **number** |  | [default to undefined]
**initial_base_amount** | **string** |  | [default to undefined]
**price** | **string** |  | [default to undefined]
**nonce** | **number** |  | [default to undefined]
**remaining_base_amount** | **string** |  | [default to undefined]
**is_ask** | **boolean** |  | [default to undefined]
**base_size** | **number** |  | [default to undefined]
**base_price** | **number** |  | [default to undefined]
**filled_base_amount** | **string** |  | [default to undefined]
**filled_quote_amount** | **string** |  | [default to undefined]
**side** | **string** |  TODO: remove this | [default to 'buy']
**type** | **string** |  | [default to undefined]
**time_in_force** | **string** |  | [default to TimeInForceEnum_GoodTillTime]
**reduce_only** | **boolean** |  | [default to undefined]
**trigger_price** | **string** |  | [default to undefined]
**order_expiry** | **number** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**trigger_status** | **string** |  | [default to undefined]
**trigger_time** | **number** |  | [default to undefined]
**parent_order_index** | **number** |  | [default to undefined]
**parent_order_id** | **string** |  | [default to undefined]
**to_trigger_order_id_0** | **string** |  | [default to undefined]
**to_trigger_order_id_1** | **string** |  | [default to undefined]
**to_cancel_order_id_0** | **string** |  | [default to undefined]
**block_height** | **number** |  | [default to undefined]
**timestamp** | **number** |  | [default to undefined]

## Example

```typescript
import { Order } from './api';

const instance: Order = {
    order_index,
    client_order_index,
    order_id,
    client_order_id,
    market_index,
    owner_account_index,
    initial_base_amount,
    price,
    nonce,
    remaining_base_amount,
    is_ask,
    base_size,
    base_price,
    filled_base_amount,
    filled_quote_amount,
    side,
    type,
    time_in_force,
    reduce_only,
    trigger_price,
    order_expiry,
    status,
    trigger_status,
    trigger_time,
    parent_order_index,
    parent_order_id,
    to_trigger_order_id_0,
    to_trigger_order_id_1,
    to_cancel_order_id_0,
    block_height,
    timestamp,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
