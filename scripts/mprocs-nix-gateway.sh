# shellcheck shell=bash

set -eo pipefail

eval "$(devimint env)"

echo Waiting for devimint to start up fedimint and gateway

STATUS="$(devimint wait)"
if [ "$STATUS" = "ERROR" ]
then
    echo "fedimint didn't start correctly"
    echo "See other panes for errors"
    exit 1
fi

TEMP_FILE=$(mktemp)
FM_LND_RPC_STRIPPED=$(echo $FM_LND_RPC_ADDR | sed 's/http[s]\?:\/\///')

cat << EOF > "$TEMP_FILE"
masterPassword: password
accounts:
  - name: test-regtest
    serverUrl: $FM_LND_RPC_STRIPPED
    macaroonPath: $FM_LND_MACAROON
    certificatePath: $FM_LND_TLS_CERT
EOF

echo $TEMP_FILE
# -----------
# Fedimint Config
# -----------
export ACCOUNT_CONFIG_PATH=$TEMP_FILE
export FM_GATEWAY_URL=$FM_GATEWAY_API_ADDR
export FM_GATEWAY_PASSWORD=$FM_GATEWAY_PASSWORD

npm run start:dev
