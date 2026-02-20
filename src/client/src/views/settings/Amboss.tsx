import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import {
  Card,
  CardWithTitle,
  SingleLine,
  SubTitle,
} from '../../components/generic/Styled';
import styled from 'styled-components';
import { getErrorContent } from '../../utils/error';
import toast from 'react-hot-toast';
import { useGetConfigStateQuery } from '../../graphql/queries/__generated__/getConfigState.generated';
import { useToggleConfigMutation } from '../../graphql/mutations/__generated__/toggleConfig.generated';
import { ConfigFields } from '../../graphql/types';
import { VFC } from 'react';
import { LoadingCard } from '../../components/loading/LoadingCard';

const NoWrapText = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;

const InputTitle = styled(NoWrapText)``;

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
      <InputTitle>{title}</InputTitle>
      <MultiButton loading={loading} width="103px">
        <SingleButton
          disabled={loading}
          selected={enabled}
          onClick={() => toggle({ variables: { field } })}
        >
          Yes
        </SingleButton>
        <SingleButton
          disabled={loading}
          selected={!enabled}
          onClick={() => toggle({ variables: { field } })}
        >
          No
        </SingleButton>
      </MultiButton>
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
