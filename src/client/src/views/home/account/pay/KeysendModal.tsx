import { FC, useState } from 'react';
import { useGetNodeQuery } from '../../../../graphql/queries/__generated__/getNode.generated';
import { useKeysendMutation } from '../../../../graphql/mutations/__generated__/keysend.generated';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../../../utils/error';
import { Input } from '@/components/ui/input';
import { Price } from '../../../../components/price/Price';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface KeysendProps {
  payCallback?: () => void;
}

const NodeInfo: FC<{ publicKey: string }> = ({ publicKey }) => {
  const { data, loading, error } = useGetNodeQuery({
    variables: { publicKey },
    skip: !publicKey,
  });

  if (!publicKey) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="animate-spin" size={12} />
        Looking up node...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
        <AlertTriangle size={12} className="shrink-0" />
        Node not found. Verify the public key is correct.
      </div>
    );
  }

  const alias = data?.getNode?.node?.alias;
  if (!alias) return null;

  return (
    <div className="rounded border border-border px-3 py-2 text-xs">
      <span className="text-muted-foreground">Node: </span>
      <span className="font-medium">{alias}</span>
    </div>
  );
};

export const Keysend: FC<KeysendProps> = ({ payCallback }) => {
  const [publicKey, setPublicKey] = useState('');
  const [tokens, setTokens] = useState(0);
  const [confirming, setConfirming] = useState(false);

  const [keysend, { loading }] = useKeysendMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent');
      if (payCallback) payCallback();
      setPublicKey('');
      setTokens(0);
      setConfirming(false);
    },
    refetchQueries: ['GetNodeInfo', 'GetBalances'],
  });

  const canSend = publicKey !== '' && tokens > 0;

  const handlePay = () => {
    if (loading || !canSend) return;
    keysend({ variables: { destination: publicKey, tokens } });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Public Key */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Public Key
        </label>
        <Input
          value={publicKey}
          placeholder="Node public key"
          onChange={e => setPublicKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePay()}
        />
      </div>

      <NodeInfo publicKey={publicKey} />

      <Separator />

      {/* Amount */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Amount{' '}
          <span className="text-foreground">
            <Price amount={tokens} />
          </span>
        </label>
        <Input
          placeholder="sats"
          type="number"
          value={tokens && tokens > 0 ? tokens : ''}
          onChange={e => setTokens(Number(e.target.value))}
          onKeyDown={e => e.key === 'Enter' && handlePay()}
        />
      </div>

      <Separator />

      {/* Send / Confirm */}
      {!confirming ? (
        <Button
          variant="outline"
          disabled={!canSend || loading}
          className="w-full"
          onClick={() => setConfirming(true)}
        >
          Send Keysend
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="divide-y divide-border rounded border border-border text-xs">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                <Price amount={tokens} />
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Destination</span>
              <span className="max-w-50 truncate font-mono text-[11px] font-medium">
                {publicKey}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!canSend || loading}
              onClick={handlePay}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                'Confirm Send'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
