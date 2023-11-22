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

# Conigure UI env from devimint env
CONFIG_PORT=$(($FM_PORT_FEDIMINTD_BASE + 1)) # Fedimintd 0 config AOU port is always base + 1
export REACT_APP_FM_CONFIG_API="ws://127.0.0.1:$CONFIG_PORT"

yarn dev:guardian-ui
