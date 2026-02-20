import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { SingleLine } from '../components/generic/Styled';
import { AmbossLoginButton } from '../views/amboss/LoginButton';
import { Backups } from '../views/amboss/Backups';
import { SectionTitle, Text } from '../components/typography/Styled';
import { Healthchecks } from '../views/amboss/Healthchecks';
import { Balances } from '../views/amboss/Balances';
import { Billboard } from '../views/amboss/Billboard';

const AmbossView = () => (
  <>
    <SingleLine>
      <SectionTitle style={{ margin: '0', color: '#ff0080', fontWeight: 900 }}>
        AMBOSS
      </SectionTitle>
      <AmbossLoginButton />
    </SingleLine>
    <Text>
      Amboss offers different integration options that can help you monitor your
      node, store backups and get historical graphs about your balances.
    </Text>
  </>
);

const AmbossPage = () => (
  <GridWrapper>
    <AmbossView />
    <Backups />
    <Healthchecks />
    <Balances />
    <Billboard />
  </GridWrapper>
);

export default AmbossPage;
