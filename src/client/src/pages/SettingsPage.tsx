import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { DashboardSettings } from '../views/settings/Dashboard';
import { SingleLine } from '../components/generic/Styled';
import { InterfaceSettings } from '../views/settings/Interface';
import { DangerView } from '../views/settings/Danger';
import { ChatSettings } from '../views/settings/Chat';
import { PrivacySettings } from '../views/settings/Privacy';
import { Security } from '../views/settings/Security';
import { NetworkInfo } from '../views/home/networkInfo/NetworkInfo';
import { NotificationSettings } from '../views/settings/Notifications';
import { AmbossSettings } from '../views/settings/Amboss';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const ButtonRow = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex w-auto', className)} {...props} />
);

export const SettingsLine = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <SingleLine className={cn('my-2', className)} {...props} />
);

const SettingsView = () => (
  <>
    <InterfaceSettings />
    <NotificationSettings />
    <AmbossSettings />
    <Security />
    <DashboardSettings />
    <PrivacySettings />
    <ChatSettings />
    <DangerView />
    <NetworkInfo />
  </>
);

const SettingsPage = () => (
  <GridWrapper>
    <SettingsView />
  </GridWrapper>
);

export default SettingsPage;
