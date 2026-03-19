#!/bin/sh
set -e

MACAROON_PATH="/root/.lit/regtest/super.macaroon"

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
    # Use bitcoind JSON-RPC directly
    RESULT=$(wget -qO- --post-data="{\"jsonrpc\":\"1.0\",\"method\":\"generatetoaddress\",\"params\":[6,\"$ADDR\"]}" \
      --header="Content-Type: application/json" \
      --header="Authorization: Basic $(echo -n rpcuser:rpcpassword | base64)" \
      "http://${BITCOIN_RPC_HOST}:18443/" 2>&1) && echo "Blocks mined" || echo "Mining skipped: $RESULT"
  fi
fi

# Wait for litd process
wait $LITD_PID
