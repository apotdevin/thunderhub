import Big from 'big.js';
import { useGatewayState } from '../context/GatewayContext';

export const useGatewayEcashTotalSats = () => {
  const { gatewayInfo } = useGatewayState();

  if (!gatewayInfo || !gatewayInfo.federations) {
    return new Big(0).toString();
  }

  return gatewayInfo.federations
    .reduce((acc, federation) => acc.add(federation.balance_msat), new Big(0))
    .div(1000) // Convert from millisatoshis to satoshis
    .toString();
};
