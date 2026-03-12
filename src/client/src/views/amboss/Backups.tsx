import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardWithTitle,
  SubTitle,
  Separation,
  SingleLine,
} from '../../components/generic/Styled';
import { Text } from '../../components/typography/Styled';
import toast from 'react-hot-toast';
import { usePushBackupMutation } from '../../graphql/mutations/__generated__/pushBackup.generated';
import { getErrorContent } from '../../utils/error';
import { useAmbossUser } from '../../hooks/UseAmbossUser';
import { getFormatDate, renderLine } from '../../components/generic/helpers';
import { useToggleConfigMutation } from '../../graphql/mutations/__generated__/toggleConfig.generated';
import { useGetConfigStateQuery } from '../../graphql/queries/__generated__/getConfigState.generated';
import { ConfigFields } from '../../graphql/types';

const PushBackup = () => {
  const [backup, { loading }] = usePushBackupMutation({
    onCompleted: () => toast.success('Backup saved on Amboss'),
    onError: error => toast.error(getErrorContent(error)),
    refetchQueries: ['GetAmbossUser'],
  });

  return (
    <SingleLine>
      <Text>Push Backup to Amboss</Text>
      <Button
        variant="outline"
        style={{ margin: '4px 0' }}
        disabled={loading}
        onClick={() => backup()}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Push</>}
      </Button>
    </SingleLine>
  );
};

export const AmbossBackupsView = () => {
  const { user } = useAmbossUser();

  const renderContent = () => {
    if (!user) return null;

    const {
      backups: { total_size_saved, last_update, last_update_size },
    } = user;

    const total = Number(total_size_saved) / 1e6;

    return (
      <>
        {renderLine(
          'Last Update',
          last_update
            ? getFormatDate(last_update)
            : 'No backups done this month'
        )}
        {last_update_size
          ? renderLine('Last Update Size', `${last_update_size} bytes`)
          : null}
        <Separation />
        {renderLine(
          'Total Size Saved',
          `${total.toLocaleString('en-US', {
            useGrouping: false,
            maximumFractionDigits: 4,
          })} MB`
        )}
        <Separation />
      </>
    );
  };

  return (
    <>
      <Separation />
      {renderContent()}
      <PushBackup />
    </>
  );
};

export const Backups = () => {
  const { data, loading } = useGetConfigStateQuery({
    onError: err => toast.error(getErrorContent(err)),
  });

  const [toggle, { loading: toggleLoading }] = useToggleConfigMutation({
    refetchQueries: ['GetConfigState'],
    onError: err => toast.error(getErrorContent(err)),
  });

  const isEnabled = data?.getConfigState.backup_state || false;

  return (
    <CardWithTitle>
      <SubTitle>Backups</SubTitle>
      <Card>
        <SingleLine>
          <Text>
            {isEnabled
              ? 'By disabling automatic backups to Amboss, ThunderHub will no longer push encrypted backups.'
              : 'By enabling automatic backups to Amboss, ThunderHub will automatically push an encrypted version of your static channel backups (SCB) whenever there is a change that needs backing up.'}
          </Text>
          <Button
            variant="outline"
            disabled={loading || toggleLoading}
            style={{ margin: '0 0 0 16px' }}
            onClick={() =>
              toggle({ variables: { field: ConfigFields.Backups } })
            }
          >
            {loading || toggleLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>{isEnabled ? 'Disable' : 'Enable'}</>
            )}
          </Button>
        </SingleLine>
        <AmbossBackupsView />
      </Card>
    </CardWithTitle>
  );
};
