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
import { useGetBackupStateQuery } from '../../graphql/queries/__generated__/getBackupState.generated';
import { useToggleAutoBackupsMutation } from '../../graphql/mutations/__generated__/toggleAutoBackups.generated';
import { getErrorContent } from '../../utils/error';
import { toast } from 'react-toastify';

const NoWrapText = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;

const InputTitle = styled(NoWrapText)``;

const AutoBackups = () => {
  const { data, loading } = useGetBackupStateQuery({
    onError: err => toast.error(getErrorContent(err)),
  });

  const [toggle, { loading: toggleLoading }] = useToggleAutoBackupsMutation({
    refetchQueries: ['GetBackupState'],
    onError: err => toast.error(getErrorContent(err)),
  });

  const enabled = data?.getBackupState || false;

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

export const AmbossSettings = () => {
  return (
    <CardWithTitle>
      <SubTitle>Amboss</SubTitle>
      <Card>
        <AutoBackups />
      </Card>
    </CardWithTitle>
  );
};
