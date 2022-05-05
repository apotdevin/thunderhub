import React from 'react';
import {
  CardWithTitle,
  CardTitle,
  SubTitle,
  Card,
  Separation,
  SingleLine,
  DarkSubTitle,
} from '../../../components/generic/Styled';
import { DownloadBackups } from './DownloadBackups';
import { VerifyBackups } from './VerifyBackups';
import { RecoverFunds } from './RecoverFunds';
import { VerifyBackup } from './VerifyBackup';
import { useAmbossUser } from '../../../hooks/UseAmbossUser';
import { getFormatDate, renderLine } from '../../../components/generic/helpers';
import numeral from 'numeral';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { usePushBackupMutation } from '../../../graphql/mutations/__generated__/pushBackup.generated';
import { getErrorContent } from '../../../utils/error';
import { toast } from 'react-toastify';

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

const AmbossBackupsView = () => {
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
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Amboss Backups</SubTitle>
      </CardTitle>
      <Card>
        {renderContent()}
        <PushBackup />
      </Card>
    </CardWithTitle>
  );
};

export const BackupsView = () => {
  return (
    <>
      <AmbossBackupsView />
      <CardWithTitle>
        <CardTitle>
          <SubTitle>Backups</SubTitle>
        </CardTitle>
        <Card>
          <DownloadBackups />
          <VerifyBackups />
          <VerifyBackup />
          <RecoverFunds />
        </Card>
      </CardWithTitle>
    </>
  );
};
