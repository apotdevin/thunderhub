import { useState, useEffect } from 'react';
import { Copy, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useCreateInvoiceMutation } from '../../../../graphql/mutations/__generated__/createInvoice.generated';
import { Link } from '../../../../components/link/Link';
import { Input } from '@/components/ui/input';
import { Price } from '../../../../components/price/Price';
import { formatSeconds } from '../../../../utils/helpers';
import { Switch } from '@/components/ui/switch';
import { getErrorContent } from '../../../../utils/error';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { InvoiceStatus } from './InvoiceStatus';
import { Timer } from './Timer';

export const CreateInvoiceCard = () => {
  const [amount, setAmount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [description, setDescription] = useState('');
  const [includePrivate, setIncludePrivate] = useState(false);

  const [request, setRequest] = useState('');
  const [id, setId] = useState('');

  const [invoiceStatus, setInvoiceStatus] = useState('none');

  const [createInvoice, { data, loading }] = useCreateInvoiceMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.createInvoice) {
      setRequest(data.createInvoice.request);
      setId(data.createInvoice.id);
    }
  }, [data, loading]);

  if (invoiceStatus === 'paid') {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <CheckCircle size={32} className="text-green-500" />
        <span className="text-sm font-medium">Invoice Paid</span>
      </div>
    );
  }

  if (invoiceStatus === 'not_paid' || invoiceStatus === 'timeout') {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-sm text-muted-foreground">
        <span>
          Check the status of this invoice in the{' '}
          <Link to="/transactions">
            <span className="text-primary hover:underline">Transactions</span>
          </Link>{' '}
          view.
        </span>
      </div>
    );
  }

  const handleEnter = () => {
    if (amount === 0) return;
    createInvoice({
      variables: { amount, description, secondsUntil: seconds, includePrivate },
    });
  };

  if (request !== '') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Invoice Created
          </span>
          <Timer initialMinute={1} initialSeconds={30} />
        </div>

        <InvoiceStatus id={id} callback={status => setInvoiceStatus(status)} />

        <div className="flex flex-col items-center gap-3">
          <div className="rounded border border-border bg-white p-3">
            <QRCodeSVG value={`lightning:${request}`} size={200} />
          </div>
          <div className="max-w-full break-all text-center font-mono text-[11px] text-muted-foreground">
            {request}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigator.clipboard
                .writeText(request)
                .then(() => toast.success('Copied to clipboard'))
            }
          >
            <Copy size={14} />
            Copy Invoice
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Amount */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Amount{' '}
          <span className="text-foreground">
            <Price amount={amount} />
          </span>
        </label>
        <Input
          placeholder="sats"
          type="number"
          value={amount && amount > 0 ? amount : ''}
          onChange={e => setAmount(Number(e.target.value))}
          onKeyDown={e => e.key === 'Enter' && handleEnter()}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Description
        </label>
        <Input
          placeholder="Optional description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleEnter()}
        />
      </div>

      <Separator />

      {/* Expires In */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Expires In{' '}
          {seconds > 0 && (
            <span className="text-foreground/60">
              ({formatSeconds(seconds)})
            </span>
          )}
        </label>
        <Input
          placeholder="seconds (0 = default)"
          type="number"
          value={seconds && seconds > 0 ? seconds : ''}
          onChange={e => setSeconds(Number(e.target.value))}
          onKeyDown={e => e.key === 'Enter' && handleEnter()}
        />
      </div>

      {/* Include Private */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Include Private Channels
        </span>
        <Switch checked={includePrivate} onCheckedChange={setIncludePrivate} />
      </div>

      <Separator />

      {/* Create */}
      <Button
        variant="outline"
        onClick={handleEnter}
        disabled={amount === 0 || loading}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          'Create Invoice'
        )}
      </Button>
    </div>
  );
};
