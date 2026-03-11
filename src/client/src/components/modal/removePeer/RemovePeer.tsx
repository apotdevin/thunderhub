import { AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRemovePeerMutation } from '@/graphql/mutations/__generated__/removePeer.generated';
import { SubTitle } from '../../generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { Button } from '@/components/ui/button';

interface RemovePeerProps {
  setModalOpen: (status: boolean) => void;
  publicKey: string;
  peerAlias: string;
}

export const RemovePeerModal = ({
  setModalOpen,
  publicKey,
  peerAlias,
}: RemovePeerProps) => {
  const [removePeer, { loading }] = useRemovePeerMutation({
    onCompleted: () => {
      toast.success('Peer Removed');
      setModalOpen(false);
    },
    onError: error => {
      toast.error(getErrorContent(error));
    },
    refetchQueries: ['GetPeers'],
  });

  const handleOnlyClose = () => setModalOpen(false);

  return (
    <div className="flex flex-col justify-center items-center">
      <AlertTriangle size={32} color={'red'} />
      <SubTitle>Are you sure you want to remove this peer?</SubTitle>
      <Button
        variant="destructive"
        onClick={() => {
          removePeer({ variables: { publicKey } });
        }}
        disabled={loading}
        style={{ margin: '4px' }}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>{`Remove Peer [${peerAlias || publicKey?.substring(0, 6)}]`}</>
        )}
      </Button>
      <Button
        variant="outline"
        style={{ margin: '4px' }}
        onClick={handleOnlyClose}
      >
        Cancel
      </Button>
    </div>
  );
};
