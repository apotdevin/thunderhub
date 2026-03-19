# ldk-server Gap Analysis for ThunderHub

This document details every ThunderHub `LightningProvider` method and field that ldk-server cannot fully support. It serves as a reference for what ldk-server would need to add for full ThunderHub feature parity.

Note: Real-time payment/invoice/forward events are handled via RabbitMQ integration, so those are not gaps.

## Entirely Unsupported Capabilities

These capabilities have no corresponding ldk-server endpoints. All methods throw "Not supported".

### BACKUPS

| Method | Notes |
|---|---|
| `getBackups()` | No backup system in ldk-server |
| `verifyBackup(backup)` | No backup system |
| `verifyBackups(args)` | No backup system |
| `recoverFundsFromChannels(backup)` | No backup system |

**What ldk-server would need:** Backup export/import/verify endpoints. LDK Node's state is persisted in its storage backend, so the equivalent might be a database snapshot/restore API.

### MACAROONS

| Method | Notes |
|---|---|
| `grantAccess(permissions)` | ldk-server uses a single API key (HMAC auth), not macaroons. No fine-grained permission tokens. |

**What ldk-server would need:** A scoped token/API key system, or the ability to create restricted API keys with specific permission sets.

### DIFFIE_HELLMAN

| Method | Notes |
|---|---|
| `diffieHellmanComputeSecret(options)` | No key derivation endpoint |

**What ldk-server would need:** An endpoint wrapping LDK's `KeysManager` to compute ECDH shared secrets, taking `partner_public_key`, `key_family`, and `key_index` as inputs.

---

## Partially Supported Capabilities

These capabilities are advertised but some methods or fields within them are missing.

### WALLET_INFO

#### `getWalletInfo()`

**Missing ldk-server data (fields returned as defaults):**

| ThunderHub Field | Current Default | What ldk-server would need |
|---|---|---|
| `color` | `'#000000'` | Add `node_color` to `GetNodeInfoResponse` |
| `version` | `'ldk-server'` | Add `version` / `ldk_node_version` to `GetNodeInfoResponse` |
| `active_channels_count` | Computed via `ListChannels` | Add counts to `GetNodeInfoResponse` (nice to have) |
| `closed_channels_count` | `0` | Requires `ListClosedChannels` (see below) |
| `peers_count` | Computed via `ListPeers` | Add count to `GetNodeInfoResponse` (nice to have) |
| `latest_block_at` | `new Date().toISOString()` | Add block timestamp to `BestBlock` |
| `is_synced_to_chain` | Derived from sync timestamps | Add explicit `is_synced` boolean (nice to have) |
| `is_synced_to_graph` | Derived from RGS timestamp | Same |

#### `getWalletVersion()`

**Entirely unsupported.** Returns dummy data. The LND-specific RPC flags (`is_autopilotrpc_enabled`, etc.) are not applicable.

**What ldk-server would need:** A `GetVersion` endpoint returning `ldk_node_version` and `ldk_server_version`.

### CHANNELS

#### `getClosedChannels()`

**Entirely unsupported.** Returns empty array. ldk-server doesn't maintain a historical record of closed channels.

**What ldk-server would need:** A `ListClosedChannels` endpoint. LDK Node emits `ChannelClosed` events — ldk-server could persist these and expose them via an API.

#### `getChannel(id)` — Channel Policy Info

Falls back to network graph (`GraphGetChannel`). Works for public channels.

**Missing fields:**

| Field | Notes |
|---|---|
| `time_offline` | Not tracked |
| `time_online` | Not tracked |
| `pending_payments` | In-flight HTLCs — not exposed |

**What ldk-server would need:** Expose HTLC details per channel in `ListChannels` response, and optionally track uptime metrics.

#### `getChannelBalance()`

Returns `totalLightningBalanceSats` from `GetBalances`.

**Missing:** `pending_balance` (returned as `0`). Could be derived from `pendingBalancesFromChannelClosures` but the shape differs.

#### `openChannel()`

ldk-server's `OpenChannel` requires a peer `address` parameter. The implementation looks up the address from `ListPeers`, so the peer must already be connected. This is an API mismatch, not a missing feature.

### CHAIN

#### `getChainTransactions()`

**Entirely unsupported.** Returns empty array.

**What ldk-server would need:** A `ListChainTransactions` endpoint, or enough data in `ListPayments` for on-chain payments to reconstruct this shape (particularly `fee`, `output_addresses`, `confirmation_count`, raw `transaction` hex).

#### `getUtxos()`

**Entirely unsupported.** Throws error.

**What ldk-server would need:** A `ListUtxos` endpoint exposing the on-chain wallet's unspent outputs. BDK tracks this data internally.

#### `sendToChainAddress()`

Works but response only contains `txid`.

**Missing response fields:** `confirmation_count`, `is_confirmed`, actual `tokens` sent (may differ from request when fees are deducted).

### PAYMENTS

#### `pay()`

Works but `Bolt11SendResponse` only returns `payment_id`.

**Missing response fields:** `fee`, `hops`, `is_confirmed`, `mtokens`, `secret` (preimage), `tokens`.

Note: The RabbitMQ `PaymentSuccessful` event delivers fee/amount/preimage to the frontend in real-time, so the user experience is not degraded. However, the `pay()` resolver still returns minimal data.

**What ldk-server would need:** Return richer data in `Bolt11SendResponse`.

#### `getPayments()`

Works via `ListPayments` filtered to outbound.

**Missing fields per payment:**

| Field | What ldk-server would need |
|---|---|
| `destination` | Add `destination_node_id` to `Payment` type |
| `hops` | Route hop tracking (significant change to LDK Node) |
| `request` | Store original BOLT11 invoice string in `Payment` |

### INVOICES

#### `createInvoice()`

Works. ldk-server returns `payment_hash` and `payment_secret` in `Bolt11ReceiveResponse`.

#### `getInvoices()`

Works via `ListPayments` filtered to inbound.

**Missing fields per invoice:** `description`, `description_hash`, `expires_at`, `request` (original BOLT11 string), `payments` (HTLC attempts).

**What ldk-server would need:** Store and return richer metadata with inbound payments.

#### `subscribeToInvoice(id)`

Works via polling `GetPaymentDetails` every 2 seconds using the payment hash. The "wait for payment" UI functions correctly.

### NETWORK_INFO

#### `getNetworkInfo()`

**Entirely unsupported.** Throws error.

**What ldk-server would need:** A `GetNetworkInfo` endpoint aggregating graph statistics (`channel_count`, `node_count`, `total_capacity`, min/max/avg/median channel sizes).

#### `getNode(public_key)`

Works via `GraphGetNode`. Minor gap: `GraphNode` only lists channel IDs, not capacities — each would require a separate `GraphGetChannel` call.

### ROUTING_FEES

#### `updateRoutingFees()`

Works via `UpdateChannelConfig` (requires channel lookup first).

**Missing:** `max_htlc_mtokens` and `min_htlc_mtokens` are not mappable — ldk-server's `ChannelConfig` doesn't expose these.

### PEERS

#### `getPeers()`

Works but several fields are unavailable.

**Missing:** `bytes_received`, `bytes_sent`, `is_inbound`, `is_sync_peer`, `ping_time`, `tokens_received`, `tokens_sent`. LDK's peer handler may not track all of these natively.

### FORWARDS

#### `getForwards()`

Works via `ListForwardedPayments`.

**Missing:** `created_at` timestamp per forward. Returned as empty string.

**What ldk-server would need:** Add a `timestamp` field to `ForwardedPayment`.

### SIGN_MESSAGE

#### `verifyMessage(message, signature)`

ldk-server's `VerifySignature` requires a `public_key` parameter. ThunderHub doesn't pass one — it expects the implementation to determine who signed it (like LND does). Current workaround: uses the node's own public key, so only self-signed messages can be verified.

**What ldk-server would need:** Return the signer's public key on successful verification, not just a boolean.

---

## Summary: Priority Additions for ldk-server

### High Priority (core ThunderHub functionality)

1. **Add `destination_node_id` to `Payment` type** — payment history display
2. **Add `timestamp` to `ForwardedPayment`** — forward history display
3. **Add `node_color` and `version` to `GetNodeInfoResponse`** — node dashboard

### Medium Priority (complete feature set)

6. **`ListClosedChannels` endpoint** — channel history
7. **`ListChainTransactions` endpoint** — on-chain transaction history
8. **`ListUtxos` endpoint** — UTXO management
9. **`GetNetworkInfo` endpoint** — network statistics dashboard
10. **Richer `OnchainSendResponse`** — amount sent, fee
11. **Store invoice metadata** — description, expiry, request string

### Low Priority (nice to have)

12. **Peer traffic statistics** in `ListPeers`
13. **Channel uptime tracking** (`time_online`/`time_offline`)
14. **HTLC details** per channel (pending payments)
15. **`max_htlc_msat`/`min_htlc_msat`** in `UpdateChannelConfig`
16. **Backup/restore endpoints**
17. **Scoped API keys** (macaroon equivalent)
18. **ECDH shared secret computation** (Diffie-Hellman)
