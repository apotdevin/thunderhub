import React from 'react';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
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

const Wrapped = () => (
  <GridWrapper>
    <ChainView />
  </GridWrapper>
);

export default Wrapped;
