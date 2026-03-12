import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { VolumeStats } from '../views/stats/FlowStats';
import { TimeStats } from '../views/stats/TimeStats';
import { FeeStats } from '../views/stats/FeeStats';
import { StatResume } from '../views/stats/StatResume';
import { StatsProvider } from '../views/stats/context';

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
