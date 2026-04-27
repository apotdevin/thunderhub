import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import DashboardView from '../views/dashboard';

const DashboardPage = () => {
  return (
    <GridWrapper centerContent={false} noPadding>
      <DashboardView />
    </GridWrapper>
  );
};

export default DashboardPage;
