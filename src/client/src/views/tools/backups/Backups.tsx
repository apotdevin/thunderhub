import {
  CardWithTitle,
  CardTitle,
  SubTitle,
  Card,
} from '../../../components/generic/Styled';
import { DownloadBackups } from './DownloadBackups';
import { VerifyBackups } from './VerifyBackups';
import { RecoverFunds } from './RecoverFunds';
import { VerifyBackup } from './VerifyBackup';

export const BackupsView = () => {
  return (
    <>
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
