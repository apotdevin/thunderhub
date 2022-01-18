import React from 'react';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { ChainTransactions } from '../src/views/chain/transactions/ChainTransactions';
import { ChainUtxos } from '../src/views/chain/utxos/ChainUtxos';
import {
  Card,
  CardWithTitle,
  SubTitle,
} from '../src/components/generic/Styled';

const ChainView = () => {
  return (
    <>
      <CardWithTitle>
        <SubTitle>Chain Utxos</SubTitle>
        <Card mobileNoBackground={true}>
          <ChainUtxos />
        </Card>
      </CardWithTitle>
      <CardWithTitle>
        <SubTitle>Chain Transactions</SubTitle>
        <Card mobileNoBackground={true}>
          <ChainTransactions />
        </Card>
      </CardWithTitle>
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <ChainView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
