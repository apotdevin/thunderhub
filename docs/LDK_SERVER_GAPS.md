# ldk-server Gap Analysis for ThunderHub

This document tracks the remaining gaps between ThunderHub's
`LightningProvider` interface and the current ldk-server gRPC API.

The ThunderHub integration uses ldk-server's gRPC service over HTTP/2 with
HMAC auth. Real-time invoice, payment, forward, and channel notifications are
handled through ldk-server's `SubscribeEvents` stream, so event delivery is not
considered a gap.

## Unsupported Methods

These ThunderHub provider methods currently throw `Not supported by ldk-server`.

### Backups

| Method                             | Notes                                        |
| ---------------------------------- | -------------------------------------------- |
| `getBackups()`                     | No backup export endpoint in ldk-server      |
| `verifyBackup(backup)`             | No backup verification endpoint              |
| `verifyBackups(args)`              | No multi-backup verification endpoint        |
| `recoverFundsFromChannels(backup)` | No static channel backup recovery equivalent |

**What ldk-server would need:** Backup export/import/verify endpoints. LDK Node
state is persisted in its storage backend, so the closest equivalent may be a
database snapshot/restore API.

### Macaroons / Access Tokens

| Method                     | Notes                                           |
| -------------------------- | ----------------------------------------------- |
| `grantAccess(permissions)` | ldk-server uses one HMAC API key, not macaroons |
| `getAccessIds()`           | No scoped-token inventory endpoint              |
| `bakeMacaroon(options)`    | No scoped token/API key creation endpoint       |

**What ldk-server would need:** A scoped API key system, or the ability to
create restricted credentials with ThunderHub-style permissions.

### Route Construction

| Method                           | Notes                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `payViaRoutes(routes)`           | ThunderHub passes explicit LND-style routes; ldk-server does its own pathfinding |
| `getRouteToDestination(options)` | No endpoint that returns a ThunderHub/LND route object                           |

**What ldk-server would need:** A route query endpoint and/or support for paying
an explicit route. ldk-server does expose route parameter configuration on send
requests, but that is not equivalent to ThunderHub's route object.

### Diffie-Hellman

| Method                                | Notes                      |
| ------------------------------------- | -------------------------- |
| `diffieHellmanComputeSecret(options)` | No key derivation endpoint |

**What ldk-server would need:** An endpoint wrapping LDK key material to compute
ECDH shared secrets from `partner_public_key`, `key_family`, and `key_index`.

### Network Aggregate Info

| Method             | Notes                                      |
| ------------------ | ------------------------------------------ |
| `getNetworkInfo()` | No endpoint for graph aggregate statistics |

**What ldk-server would need:** A `GetNetworkInfo` endpoint aggregating graph
statistics such as node count, channel count, total capacity, and channel size
distribution.

### UTXOs

| Method       | Notes                                      |
| ------------ | ------------------------------------------ |
| `getUtxos()` | No endpoint exposing on-chain wallet UTXOs |

**What ldk-server would need:** A `ListUtxos` endpoint exposing the BDK wallet's
unspent outputs.

## Partial Gaps

These methods work, but ThunderHub fills some fields with defaults or has to
work around API shape differences.

### Wallet Info

#### `getWalletInfo()`

`GetNodeInfo`, `ListChannels`, and `ListPeers` provide enough data for the main
dashboard, but these fields are incomplete:

| ThunderHub Field        | Current Behavior                          | What ldk-server would need                                   |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| `color`                 | `'#000000'`                               | Add `node_color` to `GetNodeInfoResponse`                    |
| `version`               | Static `'1.0.0 ldk-server'`               | Add ldk-server and ldk-node version fields                   |
| `chains`                | Currently mapped as `['bitcoin']`         | Map or expose network in ThunderHub's expected string format |
| `closed_channels_count` | `0`                                       | Requires closed-channel history                              |
| `active_channels_count` | Computed via `ListChannels`               | Optional count in `GetNodeInfoResponse`                      |
| `peers_count`           | Computed via `ListPeers`                  | Optional count in `GetNodeInfoResponse`                      |
| `latest_block_at`       | Current time                              | Add best-block timestamp                                     |
| `is_synced_to_chain`    | Derived from sync timestamps              | Add explicit sync status                                     |
| `is_synced_to_graph`    | Derived from RGS timestamp or wallet sync | Add explicit graph sync status                               |

#### `getWalletVersion()`

Returns dummy LND-style capability flags because those fields do not apply to
ldk-server.

**What ldk-server would need:** A version endpoint returning ldk-server and
ldk-node versions. ThunderHub could also hide LND-specific capability flags for
non-LND providers.

### Channels

#### `getClosedChannels()`

Returns an empty list. ldk-server does not expose historical closed channel
records.

**What ldk-server would need:** A `ListClosedChannels` endpoint or persisted
channel state-change history based on LDK channel events.

#### `getPendingChannels()`

Uses `ListChannels` entries where `is_channel_ready` is false. This covers
opening channels, but it does not fully model LND's pending channel categories.

**What ldk-server would need:** More detailed pending/opening/closing channel
state if ThunderHub needs to distinguish every LND pending channel variant.

#### `getChannel(id)`

Local channels are mapped from `ListChannels`; public graph channels fall back
to `GraphGetChannel`.

Missing fields:

| Field              | Notes                           |
| ------------------ | ------------------------------- |
| `time_offline`     | Not tracked                     |
| `time_online`      | Not tracked                     |
| `pending_payments` | In-flight HTLCs are not exposed |

**What ldk-server would need:** HTLC details per channel and optional uptime
tracking.

#### `getChannelBalance()`

Returns `total_lightning_balance_sats` from `GetBalances`.

**Missing:** `pending_balance` is returned as `0`. ldk-server exposes pending
on-chain sweep and lightning balance details, but they do not map cleanly to the
single LND `pending_balance` field.

#### `openChannel()`

ldk-server's `OpenChannel` requires a peer address. ThunderHub's implementation
looks up the address from `ListPeers`, so the peer must already be connected.
This is an API mismatch rather than a missing core feature.

### Chain

#### `getChainTransactions()`

Returns an empty list. ldk-server does not have a chain transaction history
endpoint.

**What ldk-server would need:** A `ListChainTransactions` endpoint, or enough
on-chain payment metadata in `ListPayments` to reconstruct ThunderHub's chain
transaction shape.

#### `getPendingChainBalance()`

Works by combining `GetBalances` fields:

- total on-chain balance
- spendable on-chain balance
- anchor reserve
- pending balances from channel closures
- claimable lightning balances awaiting on-chain settlement

This is a best-effort mapping and may not match LND exactly.

#### `sendToChainAddress()`

Works via `OnchainSend`, but the response only contains `txid`.

Missing response fields: confirmation count, confirmation status, actual amount
sent, and fee.

### Payments

#### `pay()`

Works via `Bolt11Send`. ThunderHub now decodes the invoice first and only sends
`amount_msat` for zero-amount invoices, matching ldk-server's API contract.

`Bolt11SendResponse` only returns `payment_id`, so ThunderHub returns a minimal
payment result.

Missing response fields: fee, route hops, confirmation state, amount, and
preimage. `PaymentSuccessful` events can later provide richer payment data for
UI refreshes.

#### `payViaPaymentDetails()`

Maps to ldk-server `SpontaneousSend` for keysend-style payments. The send works,
but the immediate response is minimal and uses default values for fee, hops, and
preimage.

#### `getPayments()`

Works via `ListPayments` filtered to outbound payments.

Current compatibility note: if ldk-server fails to decode older persisted
payment records, ThunderHub returns an empty list instead of surfacing the
server-side decode failure to the UI.

Missing fields per payment:

| Field         | What ldk-server would need             |
| ------------- | -------------------------------------- |
| `destination` | Add `destination_node_id` to `Payment` |
| `hops`        | Persist route hop data                 |
| `request`     | Store original BOLT11 invoice string   |

### Invoices

#### `createInvoice()`

Works via `Bolt11Receive`. ldk-server returns the invoice, payment hash, and
payment secret.

#### `getInvoices()`

Works via `ListPayments` filtered to inbound payments.

Current compatibility note: if ldk-server fails to decode older persisted
payment records, ThunderHub returns an empty list instead of surfacing the
server-side decode failure to the UI.

Missing fields per invoice: description, description hash, expiry, original
BOLT11 request string, and HTLC/payment attempt details.

**What ldk-server would need:** Store and return richer inbound payment metadata.

#### `subscribeToInvoice(id)`

Works by polling `GetPaymentDetails` every 2 seconds using the payment hash.
Global real-time updates use the `SubscribeEvents` gRPC stream.

### Network Graph

#### `getNode(public_key)`

Works via `GraphGetNode`.

Minor gap: `GraphNode` lists channel IDs, but not full channel capacities and
policies. ThunderHub currently returns those channel entries with default
capacity/policy values.

### Routing Fees

#### `updateRoutingFees()`

Works via `UpdateChannelConfig` after locating the channel with `ListChannels`.

Missing fields: `max_htlc_mtokens` and `min_htlc_mtokens` are not mappable to
ldk-server's current `ChannelConfig`.

### Peers

#### `getPeers()`

Works via `ListPeers`, but several LND peer stats are unavailable.

Missing fields: bytes received, bytes sent, inbound/outbound direction, sync
peer status, ping time, tokens received, and tokens sent.

### Forwards

#### `getForwards()`

Works via `ListForwardedPayments`.

Missing field: original forward timestamp. ThunderHub currently uses the current
time as `created_at`.

**What ldk-server would need:** Add a timestamp to `ForwardedPayment`.

### Signatures

#### `verifyMessage(message, signature)`

ldk-server's `VerifySignature` requires a `public_key`. ThunderHub's
provider-level interface does not pass one because the LND implementation can
return the signer. The current workaround verifies against the node's own public
key, so only self-signed messages can be verified.

**What ldk-server or ThunderHub would need:** Either return the signer from
verification, or change ThunderHub's provider interface to pass an expected
public key.

## Priority Additions for ldk-server

### High Priority

1. Add `destination_node_id` to `Payment`.
2. Add timestamps to `ForwardedPayment`.
3. Add ldk-server/ldk-node version fields to `GetNodeInfoResponse` or a version endpoint.
4. Add closed-channel history.
5. Add chain transaction history.

### Medium Priority

6. Add `ListUtxos`.
7. Add `GetNetworkInfo` aggregate graph statistics.
8. Return richer `Bolt11SendResponse`, `SpontaneousSendResponse`, and `OnchainSendResponse` data.
9. Store invoice metadata: description, expiry, request string, and HTLC attempts.
10. Expose channel HTLC details and richer pending channel states.

### Low Priority

11. Add peer traffic statistics.
12. Add channel uptime tracking.
13. Add `max_htlc_msat` / `min_htlc_msat` support to channel config.
14. Add backup/restore endpoints.
15. Add scoped API keys.
16. Add ECDH shared secret computation.
