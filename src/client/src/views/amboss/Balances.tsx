import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardWithTitle,
  Separation,
  SingleLine,
  SubTitle,
} from '../../components/generic/Styled';
import { Text } from '../../components/typography/Styled';
import { useToggleConfigMutation } from '../../graphql/mutations/__generated__/toggleConfig.generated';
import { useGetConfigStateQuery } from '../../graphql/queries/__generated__/getConfigState.generated';
import { ConfigFields } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';

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
    <CardWithTitle>
      <SubTitle>Balances</SubTitle>
      <Card>
        <SingleLine>
          <SubTitle>Push Onchain</SubTitle>
          <Button
            variant="outline"
            disabled={isLoading}
            style={{ margin: '0 0 0 16px' }}
            onClick={() =>
              toggle({ variables: { field: ConfigFields.OnchainPush } })
            }
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>{onchain_push_enabled ? 'Disable' : 'Enable'}</>
            )}
          </Button>
        </SingleLine>
        <Text>
          Push your onchain balance to Amboss to get historical reports.
        </Text>
        <Separation />
        <SingleLine>
          <SubTitle>Push Public Channels</SubTitle>
          <Button
            variant="outline"
            disabled={isLoading}
            style={{ margin: '0 0 0 16px' }}
            onClick={() =>
              toggle({ variables: { field: ConfigFields.ChannelsPush } })
            }
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>{channels_push_enabled ? 'Disable' : 'Enable'}</>
            )}
          </Button>
        </SingleLine>
        <Text>
          Push your public channel balances to get historical reports.
        </Text>
        <Separation />
        <SingleLine>
          <SubTitle>Push Private Channels</SubTitle>
          <Button
            variant="outline"
            disabled={isLoading}
            style={{ margin: '0 0 0 16px' }}
            onClick={() =>
              toggle({ variables: { field: ConfigFields.PrivateChannelsPush } })
            }
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>{private_channels_push_enabled ? 'Disable' : 'Enable'}</>
            )}
          </Button>
        </SingleLine>
        <Text>
          Push your private channel balances to get historical reports.
        </Text>
      </Card>
    </CardWithTitle>
  );
};
