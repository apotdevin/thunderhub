import React from 'react';
import styled from 'styled-components';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { VolumeStats } from 'src/views/stats/FlowStats';
import { TimeStats } from 'src/views/stats/TimeStats';
import { FeeStats } from 'src/views/stats/FeeStats';
import { StatResume } from 'src/views/stats/StatResume';
import { StatsProvider } from 'src/views/stats/context';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { GET_FEE_HEALTH } from 'src/graphql/queries/getFeeHealth';
import { GET_VOLUME_HEALTH } from 'src/graphql/queries/getVolumeHealth';
import { GET_TIME_HEALTH } from 'src/graphql/queries/getTimeHealth';
import { SingleLine } from '../src/components/generic/Styled';

export const ButtonRow = styled.div`
  width: auto;
  display: flex;
`;

export const SettingsLine = styled(SingleLine)`
  margin: 8px 0;
`;

const StatsView = () => {
  return (
    <>
      <StatResume />
      <VolumeStats />
      <TimeStats />
      <FeeStats />
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <StatsProvider>
      <StatsView />
    </StatsProvider>
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context, [
    GET_FEE_HEALTH,
    GET_VOLUME_HEALTH,
    GET_TIME_HEALTH,
  ]);
}
