import styled from 'styled-components';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import {
  CardWithTitle,
  SingleLine,
  SubTitle,
} from '../components/generic/Styled';
import { AdvancedBalance } from '../views/balance/AdvancedBalance';
import { HelpCircle } from 'lucide-react';
import { chartColors } from '../styles/Themes';

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

const RebalancePage = () => (
  <GridWrapper>
    <BalanceView />
  </GridWrapper>
);

export default RebalancePage;
