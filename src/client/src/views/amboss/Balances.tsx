import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useToggleConfigMutation } from '../../graphql/mutations/__generated__/toggleConfig.generated';
import { useGetConfigStateQuery } from '../../graphql/queries/__generated__/getConfigState.generated';
import { ConfigFields } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';

interface BalanceToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  loading: boolean;
  onToggle: () => void;
}

const BalanceToggle = ({
  label,
  description,
  enabled,
  loading,
  onToggle,
}: BalanceToggleProps) => (
  <div className="flex items-center justify-between gap-4">
    <div className="space-y-0.5">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <div className="flex items-center gap-2">
      {loading ? (
        <Loader2 className="animate-spin text-muted-foreground" size={14} />
      ) : null}
      <Switch checked={enabled} disabled={loading} onCheckedChange={onToggle} />
    </div>
  </div>
);

export const Balances = () => {
  const { data, loading } = useGetConfigStateQuery({
    onError: err => toast.error(getErrorContent(err)),
  });

  const [toggle, { loading: toggleLoading }] = useToggleConfigMutation({
    refetchQueries: ['GetConfigState'],
    onError: err => toast.error(getErrorContent(err)),
  });

  const {
    onchain_push_enabled = false,
    channels_push_enabled = false,
    private_channels_push_enabled = false,
  } = data?.getConfigState || {};

  const isLoading = loading || toggleLoading;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Balances</h2>
      <Card>
        <CardContent className="space-y-4">
          <BalanceToggle
            label="Onchain Balance"
            description="Push your onchain balance for historical reports"
            enabled={onchain_push_enabled}
            loading={isLoading}
            onToggle={() =>
              toggle({ variables: { field: ConfigFields.OnchainPush } })
            }
          />
          <Separator />
          <BalanceToggle
            label="Public Channels"
            description="Push your public channel balances for historical reports"
            enabled={channels_push_enabled}
            loading={isLoading}
            onToggle={() =>
              toggle({ variables: { field: ConfigFields.ChannelsPush } })
            }
          />
          <Separator />
          <BalanceToggle
            label="Private Channels"
            description="Push your private channel balances for historical reports"
            enabled={private_channels_push_enabled}
            loading={isLoading}
            onToggle={() =>
              toggle({ variables: { field: ConfigFields.PrivateChannelsPush } })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};
