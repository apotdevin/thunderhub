#!/bin/sh
set -e

MACAROON_PATH="/root/.lit/regtest/super.macaroon"
BITCOIN_RPC_USER="${BITCOIN_RPC_USER:-rpcuser}"
BITCOIN_RPC_PASS="${BITCOIN_RPC_PASS:-rpcpassword}"
BITCOIN_RPC_PORT="${BITCOIN_RPC_PORT:-18443}"

rpc_call() {
  wget -qO- \
    --header="Content-Type: application/json" \
    --post-data="$1" \
    "http://${BITCOIN_RPC_USER}:${BITCOIN_RPC_PASS}@${BITCOIN_RPC_HOST}:${BITCOIN_RPC_PORT}/" 2>/dev/null
}

# Mine 1 block before starting litd so bitcoind exits IBD mode.
# (Regtest genesis has an old timestamp so bitcoind stays in IBD until a
# block with a recent timestamp is mined — LND waits for IBD to finish.)
if [ -n "$BITCOIN_RPC_HOST" ]; then
  echo "Waiting for bitcoind RPC..."
  until rpc_call '{"jsonrpc":"1.0","method":"getnetworkinfo","params":[]}' | jq -e '.result.version' > /dev/null 2>&1; do
    sleep 2
  done
  # Only mine if bitcoind is still in IBD — existing data is left untouched.
  if rpc_call '{"jsonrpc":"1.0","method":"getblockchaininfo","params":[]}' | jq -e '.result.initialblockdownload == false' > /dev/null 2>&1; then
    echo "bitcoind already out of IBD, skipping"
  else
    echo "Mining 1 block to exit IBD..."
    # Create a wallet if none exists, then mine 1 block to any address
    rpc_call '{"jsonrpc":"1.0","method":"createwallet","params":["default"]}' > /dev/null 2>&1 || true
    ADDR=$(rpc_call '{"jsonrpc":"1.0","method":"getnewaddress","params":[]}' | jq -r '.result')
    [ -n "$ADDR" ] && [ "$ADDR" != "null" ] || { echo "Failed to get address for mining"; exit 1; }
    rpc_call "{\"jsonrpc\":\"1.0\",\"method\":\"generatetoaddress\",\"params\":[1,\"$ADDR\"]}" > /dev/null
    echo "Block mined"
  fi
fi

# Start litd in the background
litd "$@" &
LITD_PID=$!

# Wait for litd to be fully ready
echo "Waiting for litd to start..."
until litcli --network=regtest getinfo >/dev/null 2>&1; do
  sleep 2
done
echo "litd is ready"

# Bake the super macaroon if it doesn't exist
if [ ! -f "$MACAROON_PATH" ]; then
  echo "Baking super macaroon with all LiT permissions..."
  litcli --network=regtest bakesupermacaroon \
    --save_to="$MACAROON_PATH"
  echo "Super macaroon saved to $MACAROON_PATH"
else
  echo "Super macaroon already exists"
fi

# Fund wallet by mining blocks to this node's address (regtest only)
if [ -n "$BITCOIN_RPC_HOST" ]; then
  ADDR=$(lncli --network=regtest newaddress p2wkh | sed -n 's/.*"address": "\(.*\)".*/\1/p')
  if [ -n "$ADDR" ]; then
    echo "Mining 6 blocks to $ADDR..."
    rpc_call "{\"jsonrpc\":\"1.0\",\"method\":\"generatetoaddress\",\"params\":[6,\"$ADDR\"]}" > /dev/null && echo "Blocks mined" || echo "Mining skipped"
  fi
fi

# Wait for litd process
wait $LITD_PID
