# Block


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**commitment** | **string** |  | [default to undefined]
**height** | **number** |  | [default to undefined]
**state_root** | **string** |  | [default to undefined]
**priority_operations** | **number** |  | [default to undefined]
**on_chain_l2_operations** | **number** |  | [default to undefined]
**pending_on_chain_operations_pub_data** | **string** |  | [default to undefined]
**committed_tx_hash** | **string** |  | [default to undefined]
**committed_at** | **number** |  | [default to undefined]
**verified_tx_hash** | **string** |  | [default to undefined]
**verified_at** | **number** |  | [default to undefined]
**txs** | [**Array&lt;Tx&gt;**](Tx.md) |  | [default to undefined]
**status** | **number** |  | [default to undefined]
**size** | **number** |  | [default to undefined]

## Example

```typescript
import { Block } from './api';

const instance: Block = {
    commitment,
    height,
    state_root,
    priority_operations,
    on_chain_l2_operations,
    pending_on_chain_operations_pub_data,
    committed_tx_hash,
    committed_at,
    verified_tx_hash,
    verified_at,
    txs,
    status,
    size,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
