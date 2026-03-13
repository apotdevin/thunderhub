import { AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRemovePeerMutation } from '@/graphql/mutations/__generated__/removePeer.generated';
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
      toast.success('Peer removed');
      setModalOpen(false);
    },
    onError: error => {
      toast.error(getErrorContent(error));
    },
    refetchQueries: ['GetPeers'],
  });

  const displayName = peerAlias || publicKey?.substring(0, 8) + '...';

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle size={24} className="text-destructive" />
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-sm font-semibold">Remove Peer</h3>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to disconnect from{' '}
          <span className="font-medium text-foreground">{displayName}</span>?
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 pt-2">
        <Button
          variant="destructive"
          onClick={() => removePeer({ variables: { publicKey } })}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            'Remove Peer'
          )}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setModalOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
