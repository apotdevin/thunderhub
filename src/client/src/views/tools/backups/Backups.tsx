import {
  CardWithTitle,
  SubTitle,
  Card,
} from '../../../components/generic/Styled';
import { DownloadBackups } from './DownloadBackups';
import { VerifyBackups } from './VerifyBackups';
import { RecoverFunds } from './RecoverFunds';
import { VerifyBackup } from './VerifyBackup';
import { HardDrive } from 'lucide-react';

export const BackupsView = () => (
  <CardWithTitle>
    <div className="flex items-center gap-2 mb-1">
      <HardDrive size={18} className="text-muted-foreground" />
      <SubTitle>Backups</SubTitle>
    </div>
    <Card bottom="0">
      <div className="divide-y divide-border">
        <div className="pb-3">
          <DownloadBackups />
        </div>
        <div className="py-3">
          <VerifyBackups />
        </div>
        <div className="py-3">
          <VerifyBackup />
        </div>
        <div className="pt-3">
          <RecoverFunds />
        </div>
      </div>
    </Card>
  </CardWithTitle>
);
