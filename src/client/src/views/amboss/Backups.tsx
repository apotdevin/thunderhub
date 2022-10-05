import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  Card,
  CardWithTitle,
  SubTitle,
  Separation,
  SingleLine,
  DarkSubTitle,
} from '../../components/generic/Styled';
import { Text } from '../../components/typography/Styled';
import numeral from 'numeral';
import { toast } from 'react-toastify';
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
      <DarkSubTitle>Push Backup to Amboss</DarkSubTitle>
      <ColorButton
        color="#ff0080"
        withMargin={'4px 0'}
        disabled={loading}
        onClick={() => backup()}
        loading={loading}
      >
        Push
      </ColorButton>
    </SingleLine>
  );
};

export const AmbossBackupsView = () => {
  const { user } = useAmbossUser();

  const renderContent = () => {
    if (!user) return null;

    const {
      backups: {
        remaining_size,
        total_size_saved,
        last_update,
        last_update_size,
      },
    } = user;

    const total = Number(total_size_saved) / 1e6;
    const remaining = Number(remaining_size) / 1e6;

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
          `${numeral(total).format('0.[0000]')} MB`
        )}
        {renderLine(
          'Remaining Size Available',
          `${numeral(remaining).format('0.[0000]')} MB`
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
          <ColorButton
            color="#ff0080"
            loading={loading || toggleLoading}
            disabled={loading || toggleLoading}
            withMargin="0 0 0 16px"
            onClick={() =>
              toggle({ variables: { field: ConfigFields.Backups } })
            }
          >
            {isEnabled ? 'Disable' : 'Enable'}
          </ColorButton>
        </SingleLine>
        <AmbossBackupsView />
      </Card>
    </CardWithTitle>
  );
};
