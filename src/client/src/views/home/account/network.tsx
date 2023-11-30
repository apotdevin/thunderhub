import React from 'react';

export const getNetworkIndicator = (network: string) => {
  let color: string;
  let name: string;

  switch (network) {
    case 'bitcoin':
      color = 'orange';
      name = 'Mainnet';
      break;
    case 'testnet':
      color = 'limegreen';
      name = 'Testnet';
      break;
    case 'signet':
      color = 'purple';
      name = 'Signet';
      break;
    case 'regtest':
      color = 'skyblue';
      name = 'Regtest';
      break;
    default:
      color = 'gray';
      name = 'Unknown';
  }

  return <span style={{ color }}>{name}</span>;
};
