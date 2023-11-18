import Big from 'big.js';
import { useGatewayState } from '../context/GatewayContext';

export const useGatewayEcashTotal = () => {
  const { gatewayInfo } = useGatewayState();

  if (!gatewayInfo) {
    return new Big(0).toString();
  }

  return gatewayInfo.federations
    .reduce((acc, federation) => acc.add(federation.balance_msat), new Big(0))
    .toString();
};
