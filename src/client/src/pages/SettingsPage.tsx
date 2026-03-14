import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { DashboardSettings } from '../views/settings/Dashboard';
import { InterfaceSettings } from '../views/settings/Interface';
import { PrivacySettings } from '../views/settings/Privacy';
import { Security } from '../views/settings/Security';
import { NetworkInfo } from '../views/home/networkInfo/NetworkInfo';
import { NotificationSettings } from '../views/settings/Notifications';
import { AmbossSettings } from '../views/settings/Amboss';

const SettingsPage = () => (
  <GridWrapper centerContent={false}>
    <div className="flex flex-col gap-6">
      <InterfaceSettings />
      <NotificationSettings />
      <AmbossSettings />
      <Security />
      <DashboardSettings />
      <PrivacySettings />
      <NetworkInfo />
    </div>
  </GridWrapper>
);

export default SettingsPage;
