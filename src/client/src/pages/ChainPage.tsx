import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { ChainTransactions } from '../views/chain/transactions/ChainTransactions';
import { ChainUtxos } from '../views/chain/utxos/ChainUtxos';
import { Card, CardWithTitle, SubTitle } from '../components/generic/Styled';

const ChainView = () => (
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

const ChainPage = () => (
  <GridWrapper>
    <ChainView />
  </GridWrapper>
);

export default ChainPage;
