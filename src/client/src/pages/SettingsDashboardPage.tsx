import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import DashPanel from '../views/settings/DashPanel';

const SettingsDashboardPage = () => (
  <GridWrapper noNavigation={true}>
    <DashPanel />
  </GridWrapper>
);

export default SettingsDashboardPage;
