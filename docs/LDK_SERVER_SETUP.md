# Using ThunderHub with ldk-server

This guide explains how to connect ThunderHub to an
[ldk-server](https://github.com/lightningdevkit/ldk-server) node over
ldk-server's gRPC API.

## Prerequisites

- A running ldk-server instance.
- ThunderHub installed and configured.
- The ldk-server gRPC address, API key, and TLS certificate.

ldk-server's default gRPC address is `127.0.0.1:3536`. If your
`ldk-server-config.toml` sets `[node].grpc_service_address`, use that value
instead.

## Account Configuration

Add an ldk-server account to your ThunderHub YAML config file. The default path
is `~/.thunderhub/thubConfig.yaml`.

```yaml
masterPassword: 'your-password'
accounts:
  - name: 'My LDK Node'
    type: ldk-server
    serverUrl: 'https://localhost:3536'
    authToken: '<hex-encoded-api-key>'
    tlsCertPath: '/path/to/storage_dir/tls.crt'
    password: 'account-password'
```

### Required Fields

| Field       | Description                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| `name`      | Display name for the node in ThunderHub                                         |
| `type`      | Must be `ldk-server`                                                            |
| `serverUrl` | HTTPS URL for the ldk-server gRPC service, for example `https://localhost:3536` |
| `authToken` | Hex-encoded ldk-server API key                                                  |
| `password`  | Account password in ThunderHub, unless `masterPassword` is set                  |

### Recommended Fields

| Field         | Description                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| `tlsCertPath` | Path to ldk-server's PEM TLS certificate. Use this outside throwaway local development. |

ThunderHub also accepts ldk-server configs without a URL scheme and will treat
them as HTTPS, so `serverUrl: '127.0.0.1:3536'` is equivalent to
`serverUrl: 'https://127.0.0.1:3536'`.

## Finding the ldk-server Values

### gRPC Address

In `ldk-server-config.toml`, the gRPC address is configured under `[node]`:

```toml
[node]
grpc_service_address = "127.0.0.1:3536"
```

If that line is omitted, ldk-server defaults to `127.0.0.1:3536`.

Use the same address in ThunderHub's `serverUrl` with an HTTPS scheme:

```yaml
serverUrl: 'https://localhost:3536'
```

### API Key

ldk-server generates a 32-byte random API key on first startup. It is stored as
raw bytes in the network-specific storage directory:

```text
<storage_dir>/<network>/api_key
```

Examples:

```text
~/.ldk-server/regtest/api_key
~/.ldk-server/signet/api_key
/tmp/ldk-server/regtest/api_key
```

`storage_dir` comes from `[storage.disk].dir_path` in
`ldk-server-config.toml`. `network` comes from `[node].network`.

ThunderHub's `authToken` field expects this key as lowercase hex. Convert it
with:

```bash
xxd -p -c 32 /path/to/storage_dir/regtest/api_key
```

Do not use `cat`; the file contains raw bytes, not text.

### TLS Certificate

ldk-server serves gRPC over TLS. By default it stores the certificate at:

```text
<storage_dir>/tls.crt
```

If `[tls].cert_path` is set in `ldk-server-config.toml`, use that path instead.

Point ThunderHub at the certificate with `tlsCertPath`:

```yaml
tlsCertPath: '/path/to/storage_dir/tls.crt'
```

If `tlsCertPath` is omitted, ThunderHub skips TLS verification for ldk-server
connections. That is convenient for local testing, but production setups should
provide the certificate or use a publicly trusted TLS certificate.

## Real-Time Events

ThunderHub subscribes to ldk-server's gRPC `SubscribeEvents` stream using the
same `serverUrl`, `authToken`, and TLS certificate as regular API calls.

No RabbitMQ or separate event broker is required.

Current behavior: if the event stream disconnects, restart ThunderHub to
establish a fresh subscription.

## Supported Features

With ldk-server, ThunderHub currently supports:

- Node info dashboard: alias, block height, sync status, peers, channels, and balances.
- Channel management: list, open, close, force-close, and routing fee updates.
- On-chain wallet: new address, send, chain balance, and pending chain balance.
- Lightning payments: send BOLT11 invoices and keysend-style spontaneous payments.
- Invoice creation, invoice listing, and invoice payment polling.
- Peer management: connect, disconnect, and list peers.
- Forward history.
- Message signing and self-signature verification.
- Network graph node/channel queries.
- Real-time invoice/payment/forward/channel refreshes through `SubscribeEvents`.

## Known Limitations

Some ThunderHub features are LND-specific or need additional ldk-server API
support:

- Channel backups and channel recovery.
- UTXO listing.
- On-chain transaction history.
- Network aggregate statistics.
- Macaroon-style scoped credential management.
- Explicit route construction and paying via explicit routes.
- Diffie-Hellman shared secret computation.
- Full payment, invoice, peer, and forward metadata parity with LND.

See [LDK_SERVER_GAPS.md](./LDK_SERVER_GAPS.md) for the detailed method-level
breakdown.

## Example: LND and ldk-server Together

You can run LND and ldk-server accounts side by side:

```yaml
masterPassword: 'your-master-password'
accounts:
  - name: 'LND Node'
    serverUrl: 'localhost:10009'
    macaroonPath: '/path/to/admin.macaroon'
    certificatePath: '/path/to/tls.cert'

  - name: 'LDK Node'
    type: ldk-server
    serverUrl: 'https://localhost:3536'
    authToken: '<hex-encoded-ldk-server-api-key>'
    tlsCertPath: '/path/to/ldk-server/tls.crt'
```

The first account defaults to `type: lnd` when omitted. Switch between accounts
in the ThunderHub UI.

## Troubleshooting

### Connection Refused

If ThunderHub logs `ECONNREFUSED`, check the configured `serverUrl` against the
actual ldk-server gRPC listener:

```bash
ss -ltnp | grep ldk-server
```

Make sure you use the gRPC port, not the Lightning P2P port.

### Authentication Errors

If ldk-server rejects the request as unauthenticated, verify that `authToken` is
the hex encoding of the raw API key file for the same network ldk-server is
running on.

### TLS Errors

If TLS verification fails, set `tlsCertPath` to the certificate used by the
running ldk-server instance. The default path is usually
`<storage_dir>/tls.crt`.

### Payment Fails with Route Not Found

If paying an invoice fails with `RouteNotFound`, the request reached ldk-server
successfully, but ldk-server could not find a route. Check that the destination
is reachable, channels are usable, and the node has sufficient outbound
liquidity.
