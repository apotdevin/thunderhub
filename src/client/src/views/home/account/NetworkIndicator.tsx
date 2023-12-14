import React, { FC } from 'react';

interface NetworkIndicatorProps {
  network: string;
  // bitcoinRpcUrl: string;
}

const getNetworkDetails = (
  network: string
  // isMutinynet: boolean
) => {
  const networkDetails: { [key: string]: { color: string; name: string } } = {
    bitcoin: { color: '#FF9900', name: 'Mainnet' },
    main: { color: '#FF9900', name: 'Mainnet' },
    testnet: { color: '#6BED33', name: 'Testnet' },
    test: { color: '#6BED33', name: 'Testnet' },
    signet: { color: 'purple', name: 'Signet' },
    // isMutinynet
    //   ? { color: 'red', name: 'Mutinynet' }
    //   : { color: 'purple', name: 'Signet' },
    regtest: { color: '#33C6EC', name: 'Regtest' },
    default: { color: 'gray', name: 'Unknown' },
  };

  return networkDetails[network] || networkDetails['default'];
};

// const isMutinynet = (bitcoinRpcUrl: string) => {
//   try {
//     const url = new URL(bitcoinRpcUrl);
//     return url.host === 'mutinynet.com';
//   } catch (e) {
//     return false;
//   }
// };

export const NetworkIndicator: FC<NetworkIndicatorProps> = ({
  network,
  // bitcoinRpcUrl,
}) => {
  const { color, name } = getNetworkDetails(
    network
    // isMutinynet(bitcoinRpcUrl)
  );

  return (
    <div>
      Network: <span style={{ color }}>{name}</span>
    </div>
  );
};
