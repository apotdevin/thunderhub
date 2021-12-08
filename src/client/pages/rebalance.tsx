import React from 'react';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import {
  CardWithTitle,
  SingleLine,
  SubTitle,
} from '../src/components/generic/Styled';
import { AdvancedBalance } from '../src/views/balance/AdvancedBalance';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { HelpCircle } from 'react-feather';
import styled from 'styled-components';
import { chartColors } from '../src/styles/Themes';

const Button = styled.a`
  cursor: pointer;
`;

const BalanceView = () => (
  <CardWithTitle>
    <SingleLine>
      <SubTitle>Rebalance</SubTitle>
      <Button
        href={'https://apotdevin.com/blog/thunderhub-rebalance'}
        target={'__blank'}
      >
        <HelpCircle size={18} color={chartColors.orange} />
      </Button>
    </SingleLine>
    <AdvancedBalance />
  </CardWithTitle>
);

const Wrapped = () => (
  <GridWrapper>
    <BalanceView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
