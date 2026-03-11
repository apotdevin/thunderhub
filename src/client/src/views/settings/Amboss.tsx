import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardWithTitle,
  SingleLine,
  SubTitle,
} from '../../components/generic/Styled';
import { getErrorContent } from '../../utils/error';
import toast from 'react-hot-toast';
import { useGetConfigStateQuery } from '../../graphql/queries/__generated__/getConfigState.generated';
import { useToggleConfigMutation } from '../../graphql/mutations/__generated__/toggleConfig.generated';
import { ConfigFields } from '../../graphql/types';
import { VFC } from 'react';
import { LoadingCard } from '../../components/loading/LoadingCard';

const ConfigFieldToggle: VFC<{
  title: string;
  enabled: boolean;
  field: ConfigFields;
}> = ({ title, enabled, field }) => {
  const [toggle, { loading }] = useToggleConfigMutation({
    refetchQueries: ['GetConfigState'],
    onError: err => toast.error(getErrorContent(err)),
  });

  return (
    <SingleLine>
      <div className="whitespace-nowrap text-sm">{title}</div>
      <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
        {loading ? (
          <div style={{ width: '103px', textAlign: 'center' }}>
            <Loader2 className="animate-spin text-primary" size={21} />
          </div>
        ) : (
          <>
            <Button
              variant={enabled ? 'default' : 'ghost'}
              disabled={loading}
              onClick={() => toggle({ variables: { field } })}
              className={cn('grow', !enabled && 'text-foreground')}
            >
              Yes
            </Button>
            <Button
              variant={!enabled ? 'default' : 'ghost'}
              disabled={loading}
              onClick={() => toggle({ variables: { field } })}
              className={cn('grow', enabled && 'text-foreground')}
            >
              No
            </Button>
          </>
        )}
      </div>
    </SingleLine>
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
    <CardWithTitle>
      <SubTitle>Amboss</SubTitle>
      <Card>
        <ConfigFieldToggle
          field={ConfigFields.Backups}
          enabled={backup_state}
          title={'Auto Backups'}
        />
        <ConfigFieldToggle
          field={ConfigFields.Healthchecks}
          enabled={healthcheck_ping_state}
          title={'Healthcheck Pings'}
        />
        <ConfigFieldToggle
          field={ConfigFields.OnchainPush}
          enabled={onchain_push_enabled}
          title={'Onchain Push'}
        />
        <ConfigFieldToggle
          field={ConfigFields.ChannelsPush}
          enabled={channels_push_enabled}
          title={'Channels Push'}
        />
        <ConfigFieldToggle
          field={ConfigFields.PrivateChannelsPush}
          enabled={private_channels_push_enabled}
          title={'Private Channel Push'}
        />
      </Card>
    </CardWithTitle>
  );
};
