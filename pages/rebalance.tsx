import React, { useState } from 'react';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { SimpleBalance } from 'src/views/balance/SimpleBalance';
import {
  CardWithTitle,
  Card,
  SubTitle,
  SingleLine,
  SmallButton,
} from 'src/components/generic/Styled';
import { Text } from 'src/components/typography/Styled';
import { AdvancedBalance } from 'src/views/balance/AdvancedBalance';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { GET_CHANNELS } from 'src/graphql/queries/getChannels';
import { useNodeInfo } from 'src/hooks/UseNodeInfo';

const BalanceView = () => {
  const { minorVersion } = useNodeInfo();
  const [advancedType, advancedTypeSet] = useState(false);

  if (minorVersion < 9) {
    return (
      <CardWithTitle>
        <SingleLine>
          <SubTitle>Rebalance</SubTitle>
        </SingleLine>
        <Card>
          <Text>
            Channel balancing is only available for nodes with LND versions
            0.9.0-beta and up.
          </Text>
          <Text>If you want to use this feature please update your node.</Text>
        </Card>
      </CardWithTitle>
    );
  }

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
  return await getProps(context, [GET_CHANNELS]);
}
