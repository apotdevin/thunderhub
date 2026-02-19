import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { Version } from '../components/version/Version';
import { MempoolReport } from '../views/home/reports/mempool';
import { LiquidityGraph } from '../views/home/reports/liquidReport/LiquidityGraph';
import { AccountButtons } from '../views/home/account/AccountButtons';
import { AccountInfo } from '../views/home/account/AccountInfo';
import { QuickActions } from '../views/home/quickActions/QuickActions';
import { FlowBox } from '../views/home/reports/flow';
import { ForwardBox } from '../views/home/reports/forwardReport';
import { ConnectCard } from '../views/home/connect/Connect';
import { Liquidity } from '../views/home/liquidity/Liquidity';

const HomeView = () => (
  <>
    <Version />
    <AccountInfo />
    <AccountButtons />
    <ConnectCard />
    <Liquidity />
    <QuickActions />
    <FlowBox />
    <LiquidityGraph />
    <ForwardBox />
    <MempoolReport />
  </>
);

const HomePage = () => (
  <GridWrapper>
    <HomeView />
  </GridWrapper>
);

export default HomePage;
