import React, { useState } from 'react';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { SimpleBalance } from 'src/views/balance/SimpleBalance';
import {
  CardWithTitle,
  SubTitle,
  SingleLine,
  SmallButton,
} from 'src/components/generic/Styled';
import { AdvancedBalance } from 'src/views/balance/AdvancedBalance';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';

const BalanceView = () => {
  const [advancedType, advancedTypeSet] = useState(false);

  return (
    <CardWithTitle>
      <SingleLine>
        <SubTitle>Rebalance</SubTitle>
        <SingleLine>
          <SmallButton
            onClick={() => advancedTypeSet(false)}
            selected={!advancedType}
          >
            Simple
          </SmallButton>
          <SmallButton
            onClick={() => advancedTypeSet(true)}
            selected={advancedType}
          >
            Advanced
          </SmallButton>
        </SingleLine>
      </SingleLine>
      {advancedType ? <AdvancedBalance /> : <SimpleBalance />}
    </CardWithTitle>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <BalanceView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
