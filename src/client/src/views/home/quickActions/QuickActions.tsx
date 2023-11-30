import React from 'react';
import { useGatewayState } from '../../../context/GatewayContext';
import { MutinynetQuickActions } from './MutinynetQuickActions';
import { MainnetQuickActions } from './MainnetQuickActions';
import { RegtestQuickActions } from './RegtestQuickActions';
import { Network } from '../../../api/types';

export const QuickActions = () => {
  const { gatewayInfo } = useGatewayState();

  switch (gatewayInfo?.network) {
    case Network.Signet:
      return <MutinynetQuickActions />;
    case Network.Bitcoin:
      return <MainnetQuickActions />;
    case Network.Regtest:
      return <RegtestQuickActions />;
    // case Network.Testnet:
    //   return <TestnetQuickActions />;
    default:
      return null;
  }
};
