import { AlertTriangle } from 'lucide-react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { useRemovePeerMutation } from '../../../../src/graphql/mutations/__generated__/removePeer.generated';
import { SubTitle } from '../../generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { ColorButton } from '../../buttons/colorButton/ColorButton';

interface RemovePeerProps {
  setModalOpen: (status: boolean) => void;
  publicKey: string;
  peerAlias: string;
}

const WarningCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const RemovePeerModal = ({
  setModalOpen,
  publicKey,
  peerAlias,
}: RemovePeerProps) => {
  const [removePeer, { loading }] = useRemovePeerMutation({
    onCompleted: () => {
      toast.success('Peer Removed');
    },
    onError: error => {
      toast.error(getErrorContent(error));
    },
    refetchQueries: ['GetPeers'],
  });

  const handleOnlyClose = () => setModalOpen(false);

  return (
    <WarningCard>
      <AlertTriangle size={32} color={'red'} />
      <SubTitle>Are you sure you want to remove this peer?</SubTitle>
      <ColorButton
        onClick={() => {
          removePeer({ variables: { publicKey } });
        }}
        color={'red'}
        disabled={loading}
        loading={loading}
        withMargin={'4px'}
      >
        {`Remove Peer [${peerAlias || publicKey?.substring(0, 6)}]`}
      </ColorButton>
      <ColorButton withMargin={'4px'} onClick={handleOnlyClose}>
        Cancel
      </ColorButton>
    </WarningCard>
  );
};
