import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Upload, Clock, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePushBackupMutation } from '../../graphql/mutations/__generated__/pushBackup.generated';
import { getErrorContent } from '../../utils/error';
import { useAmbossUser } from '../../hooks/UseAmbossUser';
import { getFormatDate } from '../../components/generic/helpers';
import { useToggleConfigMutation } from '../../graphql/mutations/__generated__/toggleConfig.generated';
import { useGetConfigStateQuery } from '../../graphql/queries/__generated__/getConfigState.generated';
import { ConfigFields } from '../../graphql/types';

const BackupStats = () => {
  const { user } = useAmbossUser();

  if (!user) return null;

  const {
    backups: { total_size_saved, last_update, last_update_size },
  } = user;

  const total = Number(total_size_saved) / 1e6;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-muted p-2">
          <Clock size={16} className="text-muted-foreground" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">Last Update</p>
          <p className="text-sm font-medium text-foreground">
            {last_update ? getFormatDate(last_update) : 'No backups this month'}
          </p>
        </div>
      </div>
      {last_update_size ? (
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-muted p-2">
            <Upload size={16} className="text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Last Size</p>
            <p className="text-sm font-medium text-foreground">
              {last_update_size} bytes
            </p>
          </div>
        </div>
      ) : null}
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-muted p-2">
          <HardDrive size={16} className="text-muted-foreground" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">Total Saved</p>
          <p className="text-sm font-medium text-foreground">
            {total.toLocaleString('en-US', {
              useGrouping: false,
              maximumFractionDigits: 4,
            })}{' '}
            MB
          </p>
        </div>
      </div>
    </div>
  );
};

export const Backups = () => {
  const { user } = useAmbossUser();

  const { data, loading } = useGetConfigStateQuery({
    onError: err => toast.error(getErrorContent(err)),
  });

  const [toggle, { loading: toggleLoading }] = useToggleConfigMutation({
    refetchQueries: ['GetConfigState'],
    onError: err => toast.error(getErrorContent(err)),
  });

  const [backup, { loading: backupLoading }] = usePushBackupMutation({
    onCompleted: () => toast.success('Backup saved on Amboss'),
    onError: error => toast.error(getErrorContent(error)),
    refetchQueries: ['GetAmbossUser'],
  });

  const isEnabled = data?.getConfigState.backup_state || false;
  const isLoading = loading || toggleLoading;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          Backups
          <Badge
            variant="secondary"
            className={cn(
              'shrink-0 text-[10px] rounded-sm',
              isEnabled && 'bg-green-500/10 text-green-600 dark:text-green-400'
            )}
          >
            {isEnabled ? 'Active' : 'Inactive'}
          </Badge>
        </h2>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="animate-spin text-muted-foreground" size={14} />
          ) : null}
          <Switch
            checked={isEnabled}
            disabled={isLoading}
            onCheckedChange={() =>
              toggle({ variables: { field: ConfigFields.Backups } })
            }
          />
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4">
          {user ? (
            <>
              <BackupStats />
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Manual Backup
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Push a backup to Amboss now
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={backupLoading}
                  onClick={() => backup()}
                >
                  {backupLoading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <>
                      <Upload size={14} className="mr-1.5" />
                      Push Backup
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isEnabled
                ? 'Automatically pushing encrypted static channel backups (SCB) whenever changes occur.'
                : 'Enable to automatically push encrypted static channel backups (SCB) to Amboss when changes occur.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
