import React from 'react';
import styled from 'styled-components';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { withApollo } from 'config/client';
import { VolumeStats } from 'src/views/stats/VolumeStats';
import { TimeStats } from 'src/views/stats/TimeStats';
import { FeeStats } from 'src/views/stats/FeeStats';
import { SingleLine } from '../src/components/generic/Styled';

export const ButtonRow = styled.div`
  width: auto;
  display: flex;
`;

export const SettingsLine = styled(SingleLine)`
  margin: 8px 0;
`;

const SettingsView = () => {
  return (
    <>
      <VolumeStats />
      <TimeStats />
      <FeeStats />
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <SettingsView />
  </GridWrapper>
);

export default withApollo(Wrapped);
