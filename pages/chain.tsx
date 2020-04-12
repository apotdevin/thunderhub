import React from 'react';

import { ChainTransactions } from '../src/views/chain/transactions/ChainTransactions';
import { ChainUtxos } from '../src/views/chain/utxos/ChainUtxos';

const ChainView = () => {
  return (
    <>
      <ChainUtxos />
      <ChainTransactions />
    </>
  );
};

export default ChainView;
