import { Card, CardContent } from '@/components/ui/card';
import { DownloadBackups } from './DownloadBackups';
import { VerifyBackups } from './VerifyBackups';
import { RecoverFunds } from './RecoverFunds';
import { VerifyBackup } from './VerifyBackup';

export const BackupsView = () => (
  <div className="flex flex-col gap-4">
    <h2 className="text-lg font-semibold">Backups</h2>
    <Card>
      <CardContent>
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
      </CardContent>
    </Card>
  </div>
);
