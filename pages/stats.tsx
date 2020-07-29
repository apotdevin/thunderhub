import React from 'react';
import styled from 'styled-components';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { VolumeStats } from 'src/views/stats/FlowStats';
import { TimeStats } from 'src/views/stats/TimeStats';
import { FeeStats } from 'src/views/stats/FeeStats';
import { StatResume } from 'src/views/stats/StatResume';
import { StatsProvider } from 'src/views/stats/context';
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
