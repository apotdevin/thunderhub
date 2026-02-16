import styled from 'styled-components';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { VolumeStats } from '../views/stats/FlowStats';
import { TimeStats } from '../views/stats/TimeStats';
import { FeeStats } from '../views/stats/FeeStats';
import { StatResume } from '../views/stats/StatResume';
import { StatsProvider } from '../views/stats/context';
import { SingleLine } from '../components/generic/Styled';

export const ButtonRow = styled.div`
  width: auto;
  display: flex;
`;

export const SettingsLine = styled(SingleLine)`
  margin: 8px 0;
`;

const StatsView = () => (
  <>
    <StatResume />
    <VolumeStats />
    <TimeStats />
    <FeeStats />
  </>
);

const StatsPage = () => (
  <GridWrapper>
    <StatsProvider>
      <StatsView />
    </StatsProvider>
  </GridWrapper>
);

export default StatsPage;
