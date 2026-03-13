import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { Version } from '../components/version/Version';
import { LiquidityGraph } from '../views/home/reports/liquidReport/LiquidityGraph';
import { AccountButtons } from '../views/home/account/AccountButtons';
import { QuickActions } from '../views/home/quickActions/QuickActions';
import { FlowBox } from '../views/home/reports/flow';
import { ForwardBox } from '../views/home/reports/forwardReport';
import { ConnectCard } from '../views/home/connect/Connect';

const HomeView = () => (
  <div className="flex flex-col gap-4">
    <Version />
    <AccountButtons />
    <ConnectCard />
    <QuickActions />
    <FlowBox />
    <LiquidityGraph />
    <ForwardBox />
  </div>
);

const HomePage = () => (
  <GridWrapper>
    <HomeView />
  </GridWrapper>
);

export default HomePage;
