import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getErrorContent } from '../../utils/error';
import toast from 'react-hot-toast';
import { useGetConfigStateQuery } from '../../graphql/queries/__generated__/getConfigState.generated';
import { useToggleConfigMutation } from '../../graphql/mutations/__generated__/toggleConfig.generated';
import { ConfigFields } from '../../graphql/types';
import { FC } from 'react';
import { LoadingCard } from '../../components/loading/LoadingCard';

const ConfigFieldToggle: FC<{
  title: string;
  enabled: boolean;
  field: ConfigFields;
}> = ({ title, enabled, field }) => {
  const [toggle, { loading }] = useToggleConfigMutation({
    refetchQueries: ['GetConfigState'],
    onError: err => toast.error(getErrorContent(err)),
  });

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{title}</span>
      {loading ? (
        <Loader2 className="animate-spin text-muted-foreground" size={18} />
      ) : (
        <Switch
          checked={enabled}
          disabled={loading}
          onCheckedChange={() => toggle({ variables: { field } })}
        />
      )}
    </div>
  );
};

export const AmbossSettings = () => {
  const { data, loading } = useGetConfigStateQuery({
    onError: err => toast.error(getErrorContent(err)),
  });

  if (loading) {
    return <LoadingCard title="Amboss" />;
  }

  if (!data?.getConfigState) {
    return null;
  }

  const {
    backup_state,
    channels_push_enabled,
    healthcheck_ping_state,
    onchain_push_enabled,
    private_channels_push_enabled,
  } = data.getConfigState;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Amboss</h2>
      <Card>
        <CardContent className="space-y-4">
          <ConfigFieldToggle
            field={ConfigFields.Backups}
            enabled={backup_state}
            title="Auto Backups"
          />
          <ConfigFieldToggle
            field={ConfigFields.Healthchecks}
            enabled={healthcheck_ping_state}
            title="Healthcheck Pings"
          />
          <ConfigFieldToggle
            field={ConfigFields.OnchainPush}
            enabled={onchain_push_enabled}
            title="Onchain Push"
          />
          <ConfigFieldToggle
            field={ConfigFields.ChannelsPush}
            enabled={channels_push_enabled}
            title="Channels Push"
          />
          <ConfigFieldToggle
            field={ConfigFields.PrivateChannelsPush}
            enabled={private_channels_push_enabled}
            title="Private Channel Push"
          />
        </CardContent>
      </Card>
    </div>
  );
};
