import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../../../utils/error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { ChannelSelect } from '../../../../components/select/specific/ChannelSelect';
import { useDecodeRequestQuery } from '../../../../graphql/queries/__generated__/decodeRequest.generated';
import { Price } from '../../../../components/price/Price';
import { usePayMutation } from '../../../../graphql/mutations/__generated__/pay.generated';
import { Separator } from '@/components/ui/separator';

interface PayProps {
  predefinedRequest?: string;
  payCallback?: () => void;
}

const DecodeInvoice: FC<{ invoice: string | undefined | null }> = ({
  invoice,
}) => {
  const { data, loading } = useDecodeRequestQuery({
    variables: { request: invoice || '' },
    skip: !invoice,
    onError: () => toast.error('Error decoding invoice'),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
        <Loader2 className="animate-spin" size={14} />
        Decoding...
      </div>
    );
  }

  if (!data?.decodeRequest || !invoice) return null;

  const { description, tokens, destination_node } = data.decodeRequest;
  const { alias } = destination_node?.node || { alias: 'Unknown' };

  return (
    <div className="divide-y divide-border rounded border border-border text-xs">
      {description && (
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-muted-foreground">Description</span>
          <span className="font-medium">{description}</span>
        </div>
      )}
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-muted-foreground">Amount</span>
        <span className="font-medium">
          <Price amount={tokens} />
        </span>
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-muted-foreground">Destination</span>
        <span className="font-medium">{alias}</span>
      </div>
    </div>
  );
};

export const Pay: FC<PayProps> = ({ predefinedRequest, payCallback }) => {
  const [request, setRequest] = useState<string>(predefinedRequest || '');
  const [peers, setPeers] = useState<string[]>([]);
  const [fee, setFee] = useState<number>(10);
  const [paths, setPaths] = useState<number>(1);
  const [confirming, setConfirming] = useState(false);

  const [pay, { loading }] = usePayMutation({
    onCompleted: () => {
      if (payCallback) payCallback();
      toast.success('Payment Sent');
      setRequest('');
      setConfirming(false);
    },
    onError: error => toast.error(getErrorContent(error)),
  });

  const handlePay = () => {
    if (loading || !request) return;
    pay({
      variables: {
        max_fee: fee,
        max_paths: paths,
        request,
        ...(peers?.length && { out: peers }),
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Invoice */}
      {!predefinedRequest && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Invoice
          </label>
          <Input
            value={request}
            placeholder="lnbc..."
            onChange={e => setRequest(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePay()}
          />
        </div>
      )}

      {/* Decoded info */}
      <DecodeInvoice invoice={request || predefinedRequest} />

      <Separator />

      {/* Max Fee */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Max Fee{' '}
          <span className="text-foreground">
            <Price amount={fee} />
          </span>
        </label>
        <Input
          placeholder="sats"
          type="number"
          value={fee && fee > 0 ? fee : ''}
          onChange={e => setFee(Math.max(1, Number(e.target.value)))}
          onKeyDown={e => e.key === 'Enter' && handlePay()}
        />
      </div>

      {/* Max Paths */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Max Paths
        </label>
        <Input
          placeholder="paths"
          type="number"
          value={paths && paths > 0 ? paths : ''}
          onChange={e => setPaths(Math.max(1, Number(e.target.value)))}
          onKeyDown={e => e.key === 'Enter' && handlePay()}
        />
      </div>

      <Separator />

      {/* Out Channels */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Out Channels
        </label>
        <ChannelSelect callback={p => setPeers(p.map(peer => peer.id))} />
      </div>

      <Separator />

      {/* Pay / Confirm */}
      {!confirming ? (
        <Button
          variant="outline"
          disabled={loading || !request}
          className="w-full"
          onClick={() => setConfirming(true)}
        >
          Pay
        </Button>
      ) : (
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
            disabled={loading || !request}
            onClick={handlePay}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Confirm Pay'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
