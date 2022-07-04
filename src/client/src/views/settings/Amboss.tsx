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
import { useToggleAutoBackupsMutation } from '../../graphql/mutations/__generated__/toggleAutoBackups.generated';
import { getErrorContent } from '../../utils/error';
import { toast } from 'react-toastify';
import { useGetConfigStateQuery } from '../../graphql/queries/__generated__/getConfigState.generated';
import { useToggleHealthPingsMutation } from '../../graphql/mutations/__generated__/toggleHealthPings.generated';

const NoWrapText = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;

const InputTitle = styled(NoWrapText)``;

const AutoBackups = () => {
  const { data, loading } = useGetConfigStateQuery({
    onError: err => toast.error(getErrorContent(err)),
  });

  const [toggle, { loading: toggleLoading }] = useToggleAutoBackupsMutation({
    refetchQueries: ['GetConfigState'],
    onError: err => toast.error(getErrorContent(err)),
  });

  const enabled = data?.getConfigState.backup_state || false;

  return (
    <SingleLine>
      <InputTitle>Auto Backups</InputTitle>
      <MultiButton loading={loading || toggleLoading} width="103px">
        <SingleButton
          disabled={loading || toggleLoading}
          selected={enabled}
          onClick={toggle}
        >
          Yes
        </SingleButton>
        <SingleButton
          disabled={loading || toggleLoading}
          selected={!enabled}
          onClick={toggle}
        >
          No
        </SingleButton>
      </MultiButton>
    </SingleLine>
  );
};

const HealthPings = () => {
  const { data, loading } = useGetConfigStateQuery({
    onError: err => toast.error(getErrorContent(err)),
  });

  const [toggle, { loading: toggleLoading }] = useToggleHealthPingsMutation({
    refetchQueries: ['GetConfigState'],
    onError: err => toast.error(getErrorContent(err)),
  });

  const enabled = data?.getConfigState.healthcheck_ping_state || false;

  return (
    <SingleLine>
      <InputTitle>Healthcheck Pings</InputTitle>
      <MultiButton loading={loading || toggleLoading} width="103px">
        <SingleButton
          disabled={loading || toggleLoading}
          selected={enabled}
          onClick={toggle}
        >
          Yes
        </SingleButton>
        <SingleButton
          disabled={loading || toggleLoading}
          selected={!enabled}
          onClick={toggle}
        >
          No
        </SingleButton>
      </MultiButton>
    </SingleLine>
  );
};

export const AmbossSettings = () => {
  return (
    <CardWithTitle>
      <SubTitle>Amboss</SubTitle>
      <Card>
        <AutoBackups />
        <HealthPings />
      </Card>
    </CardWithTitle>
  );
};
