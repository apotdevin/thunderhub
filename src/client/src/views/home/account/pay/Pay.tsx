import { FC, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../../../utils/error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { ChannelSelect } from '../../../../components/select/specific/ChannelSelect';
import { Price } from '../../../../components/price/Price';
import { usePayMutation } from '../../../../graphql/mutations/__generated__/pay.generated';
import { Separator } from '@/components/ui/separator';
import { decode } from 'light-bolt11-decoder';

interface PayProps {
  predefinedRequest?: string;
  payCallback?: () => void;
  defaultFee?: number;
  defaultPaths?: number;
}

const getDecodedInvoice = (invoice: string | undefined | null) => {
  if (!invoice) return null;
  try {
    const decoded = decode(invoice);
    const description =
      (
        decoded.sections.find(s => s.name === 'description') as
          | { value: string }
          | undefined
      )?.value || null;
    const amount =
      (
        decoded.sections.find(s => s.name === 'amount') as
          | { value: string }
          | undefined
      )?.value || null;
    // amount is in millisatoshis string, convert to sats
    const tokens = amount ? Math.floor(Number(amount) / 1000) : null;
    return { description, tokens };
  } catch {
    return null;
  }
};

const DecodeInvoice: FC<{ invoice: string | undefined | null }> = ({
  invoice,
}) => {
  const decoded = useMemo(() => getDecodedInvoice(invoice), [invoice]);

  if (!decoded || !invoice) return null;

  const { description, tokens } = decoded;

  return (
    <div className="divide-y divide-border rounded border border-border text-xs">
      {description && (
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-muted-foreground">Description</span>
          <span className="font-medium">{description}</span>
        </div>
      )}
      {tokens !== null && (
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium">
            <Price amount={tokens} />
          </span>
        </div>
      )}
    </div>
  );
};

export const Pay: FC<PayProps> = ({
  predefinedRequest,
  payCallback,
  defaultFee = 100,
  defaultPaths = 10,
}) => {
  const [request, setRequest] = useState<string>(predefinedRequest || '');
  const [peers, setPeers] = useState<string[]>([]);
  const [fee, setFee] = useState<number>(defaultFee);
  const [paths, setPaths] = useState<number>(defaultPaths);
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

      {/* Max Fee, Max Paths, Out Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Out Channels
          </label>
          <ChannelSelect callback={p => setPeers(p.map(peer => peer.id))} />
        </div>
      </div>

      <Separator />

      {/* Pay / Confirm */}
      {!confirming ? (
        <Button
          variant="outline"
          disabled={loading || !request}
          className="w-full"
          onClick={() => setConfirming(true)}
          autoFocus
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
