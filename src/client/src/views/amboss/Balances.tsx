import { toast } from 'react-toastify';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
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

  return (
    <CardWithTitle>
      <SubTitle>Balances</SubTitle>
      <Card>
        <SingleLine>
          <SubTitle>Push Onchain</SubTitle>
          <ColorButton
            color="#ff0080"
            loading={loading || toggleLoading}
            disabled={loading || toggleLoading}
            withMargin="0 0 0 16px"
            onClick={() =>
              toggle({ variables: { field: ConfigFields.OnchainPush } })
            }
          >
            {onchain_push_enabled ? 'Disable' : 'Enable'}
          </ColorButton>
        </SingleLine>
        <Text>
          Push your onchain balance to Amboss to get historical reports. This data will be shared with third parties.
        </Text>
        <Separation />
        <SingleLine>
          <SubTitle>Push Public Channels</SubTitle>
          <ColorButton
            color="#ff0080"
            loading={loading || toggleLoading}
            disabled={loading || toggleLoading}
            withMargin="0 0 0 16px"
            onClick={() =>
              toggle({ variables: { field: ConfigFields.ChannelsPush } })
            }
          >
            {channels_push_enabled ? 'Disable' : 'Enable'}
          </ColorButton>
        </SingleLine>
        <Text>
          Push your public channel balances to get historical reports.
        </Text>
        <Separation />
        <SingleLine>
          <SubTitle>Push Private Channels</SubTitle>
          <ColorButton
            color="#ff0080"
            loading={loading || toggleLoading}
            disabled={loading || toggleLoading}
            withMargin="0 0 0 16px"
            onClick={() =>
              toggle({ variables: { field: ConfigFields.PrivateChannelsPush } })
            }
          >
            {private_channels_push_enabled ? 'Disable' : 'Enable'}
          </ColorButton>
        </SingleLine>
        <Text>
          Push your private channel balances to get historical reports.
        </Text>
      </Card>
    </CardWithTitle>
  );
};
