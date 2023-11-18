import { useGatewayState } from '../context/GatewayContext';

export const useGatewayFederations = () => {
  const { gatewayInfo } = useGatewayState();

  if (!gatewayInfo) {
    return [];
  }

  return gatewayInfo.federations;
};
