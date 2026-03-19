import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useToggleConfigMutation } from '../../graphql/mutations/__generated__/toggleConfig.generated';
import { useGetConfigStateQuery } from '../../graphql/queries/__generated__/getConfigState.generated';
import { ConfigFields } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';

export const Healthchecks = () => {
  const { data, loading } = useGetConfigStateQuery({
    onError: err => toast.error(getErrorContent(err)),
  });

  const [toggle, { loading: toggleLoading }] = useToggleConfigMutation({
    refetchQueries: ['GetConfigState'],
    onError: err => toast.error(getErrorContent(err)),
  });

  const isEnabled = data?.getConfigState.healthcheck_ping_state || false;
  const isLoading = loading || toggleLoading;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          Healthchecks
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
              toggle({ variables: { field: ConfigFields.Healthchecks } })
            }
          />
        </div>
      </div>

      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isEnabled
              ? 'ThunderHub consistently pings Amboss to show the liveliness of your node.'
              : 'Enable to automatically ping Amboss and show the liveliness of your node.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
