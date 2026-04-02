# Litd + ThunderHub Docker Setup

> [!TIP]
> For a deep dive into how these components interact, see the [Official ThunderHub + Litd Integration Guide](https://docs.thunderhub.io/litd).

Two-node local development environment with Bitcoin Core (regtest), two Lightning Terminal (litd) nodes (Alice & Bob), and two ThunderHub instances.

Alice is configured with a public universe (`--taproot-assets.universe.public-access=rw`), allowing other nodes to sync assets from her.

## Quick Start

```bash
cd docker/litd
docker compose up --build
```

Wait for both litd nodes to initialize, then open:

- **ThunderHub Alice**: http://localhost:3000
- **ThunderHub Bob**: http://localhost:3001
- **Litd Alice UI**: https://localhost:8443 (password: `testpassword123!`)
- **Litd Bob UI**: https://localhost:8444 (password: `testpassword123!`)

Login password for both ThunderHub instances: `thunderhub`

## Services

| Service          | Port  | Description                          |
|-----------------|-------|--------------------------------------|
| bitcoind        | 18443 | Bitcoin Core RPC (regtest)           |
| litd-alice      | 8443  | Alice's litd UI / gRPC proxy        |
| litd-alice      | 10009 | Alice's LND gRPC                    |
| litd-alice      | 9735  | Alice's LND P2P                     |
| litd-bob        | 8444  | Bob's litd UI / gRPC proxy          |
| litd-bob        | 10010 | Bob's LND gRPC                      |
| litd-bob        | 9736  | Bob's LND P2P                       |
| thunderhub-alice| 3000  | Alice's ThunderHub                   |
| thunderhub-bob  | 3001  | Bob's ThunderHub                     |

## Fund Wallets and Mine Blocks

```bash
# Fund Alice (6 blocks)
docker compose exec bitcoind bitcoin-cli -regtest -rpcuser=rpcuser -rpcpassword=rpcpassword generatetoaddress 6 $(docker compose exec litd-alice lncli --network=regtest newaddress p2wkh | jq -r '.address')

# Fund Bob (6 blocks)
docker compose exec bitcoind bitcoin-cli -regtest -rpcuser=rpcuser -rpcpassword=rpcpassword generatetoaddress 6 $(docker compose exec litd-bob lncli --network=regtest newaddress p2wkh | jq -r '.address')
```

## Connect Peers and Open Channel

```bash
# Get Bob's pubkey and address
BOB_PUBKEY=$(docker compose exec litd-bob lncli --network=regtest getinfo | jq -r '.identity_pubkey')

# Connect Alice to Bob
docker compose exec litd-alice lncli --network=regtest connect ${BOB_PUBKEY}@litd-bob:9735

# Open channel from Alice to Bob (1M sats)
docker compose exec litd-alice lncli --network=regtest openchannel --node_key=${BOB_PUBKEY} --local_amt=1000000

# Mine blocks to confirm
docker compose exec bitcoind bitcoin-cli -regtest -rpcuser=rpcuser -rpcpassword=rpcpassword generatetoaddress 6 $(docker compose exec litd-alice lncli --network=regtest newaddress p2wkh | jq -r '.address')
```

## Taproot Asset Workflow

```bash
# Alice mints an asset
docker compose exec litd-alice tapcli --tlscertpath=/root/.lit/tls.cert --macaroonpath=/root/.lit/regtest/super.macaroon --rpcserver=localhost:8443 assets mint --type normal --name Thunderbux --supply 1000 --new_grouped_asset

# Finalize the mint batch
docker compose exec litd-alice tapcli --tlscertpath=/root/.lit/tls.cert --macaroonpath=/root/.lit/regtest/super.macaroon --rpcserver=localhost:8443 assets mint finalize

# Mine blocks to confirm
docker compose exec bitcoind bitcoin-cli -regtest -rpcuser=rpcuser -rpcpassword=rpcpassword generatetoaddress 6 $(docker compose exec litd-alice lncli --network=regtest newaddress p2wkh | jq -r '.address')
```

## Add Universe Federation (for asset transfers between nodes)

For Bob to receive assets from Alice, both nodes should federate their universes:

```bash
# Add Alice's universe to Bob's federation
docker compose exec litd-bob tapcli --tlscertpath=/root/.lit/tls.cert --macaroonpath=/root/.lit/regtest/super.macaroon --rpcserver=localhost:8443 universe federation add --universe_host=litd-alice:8443

# Add Bob's universe to Alice's federation
docker compose exec litd-alice tapcli --tlscertpath=/root/.lit/tls.cert --macaroonpath=/root/.lit/regtest/super.macaroon --rpcserver=localhost:8443 universe federation add --universe_host=litd-bob:8443
```

## Cleanup

```bash
docker compose down       # stop containers, keep data
rm -rf data/              # remove all persistent data
```
