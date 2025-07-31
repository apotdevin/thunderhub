import React from 'react';
import { GridWrapper } from '../../src/components/gridWrapper/GridWrapper';
import { SingleLine } from '../../src/components/generic/Styled';
import { NextPageContext } from 'next';
import { getProps } from '../../src/utils/ssr';
import { AmbossLoginButton } from '../../src/views/amboss/LoginButton';
import { Backups } from '../../src/views/amboss/Backups';
import { SectionTitle, Text } from '../../src/components/typography/Styled';
import { Healthchecks } from '../../src/views/amboss/Healthchecks';
import { Balances } from '../../src/views/amboss/Balances';
import { Billboard } from '../../src/views/amboss/Billboard';

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

const Wrapped = () => (
  <GridWrapper>
    <AmbossView />
    <Backups />
    <Healthchecks />
    <Balances />
    <Billboard />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
