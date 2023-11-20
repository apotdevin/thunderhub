# shellcheck shell=bash

eval "$(devimint env)"

echo Waiting for devimint to start up fedimint

STATUS="$(devimint wait)"
if [ "$STATUS" = "ERROR" ]
then
    echo "fedimint didn't start correctly"
    echo "See other panes for errors"
    exit 1
fi

alias lightning-cli="\$FM_LIGHTNING_CLI"
alias lncli="\$FM_LNCLI"
alias bitcoin-cli="\$FM_BTC_CLIENT"
alias fedimint-cli="\$FM_MINT_CLIENT"
alias gateway-cln="\$FM_GWCLI_CLN"
alias gateway-lnd="\$FM_GWCLI_LND"

eval "$(fedimint-cli completion bash)" || true
eval "$(gateway-cli completion bash)" || true

echo Done!
echo
echo "This shell provides the following aliases:"
echo ""
echo "  fedimint-cli   - cli client to interact with the federation"
echo "  lightning-cli  - cli client for Core Lightning"
echo "  lncli          - cli client for LND"
echo "  bitcoin-cli    - cli client for bitcoind"
echo "  gateway-cln    - cli client for the CLN gateway"
echo "  gateway-lnd    - cli client for the LND gateway"
echo
echo "Use '--help' on each command for more information"
echo ""
echo "Important mprocs key sequences:"
echo ""
echo "  ctrl+a <up/down arrow> - switching between panels"
echo "  ctrl+a q               - quit mprocs"
