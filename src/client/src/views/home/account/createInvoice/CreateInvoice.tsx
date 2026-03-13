import { useState, useEffect } from 'react';
import { Copy, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
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
import { useChartColors } from '../../../../lib/chart-colors';
import { InvoiceStatus } from './InvoiceStatus';
import { Timer } from './Timer';

export const CreateInvoiceCard = () => {
  const chartColors = useChartColors();
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
      <div className="flex justify-center items-center">
        <CheckCircle stroke={chartColors.green} size={32} />
        <div className="font-extrabold text-white">Paid</div>
      </div>
    );
  }

  if (invoiceStatus === 'not_paid' || invoiceStatus === 'timeout') {
    return (
      <div className="flex justify-center items-center">
        <div className="font-extrabold text-white">
          Check the status of this invoice in the
          <Link to={'/transactions'}> Transactions </Link>
          view
        </div>
      </div>
    );
  }

  const renderQr = () => (
    <>
      <Timer initialMinute={1} initialSeconds={30} />
      <div className="flex flex-col justify-between items-center md:flex-row">
        <InvoiceStatus id={id} callback={status => setInvoiceStatus(status)} />
        <div className="w-[280px] h-[280px] m-4 bg-white p-4">
          <QRCodeSVG value={`lightning:${request}`} size={248} />
        </div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="wrap-break-words m-6 text-sm">{request}</div>
          <Button
            variant="outline"
            onClick={() =>
              navigator.clipboard
                .writeText(request)
                .then(() => toast.success('Request Copied'))
            }
          >
            <Copy size={18} />
            Copy
          </Button>
        </div>
      </div>
    </>
  );

  const handleEnter = () => {
    if (amount === 0) return;
    createInvoice({
      variables: { amount, description, secondsUntil: seconds, includePrivate },
    });
  };

  const renderContent = () => (
    <>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Amount to receive</span>
          <span className="text-muted-foreground mx-2 ml-4">
            <Price amount={amount} />
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          placeholder={'sats'}
          type={'number'}
          value={amount && amount > 0 ? amount : ''}
          onChange={e => setAmount(Number(e.target.value))}
          onKeyDown={e => e.key === 'Enter' && handleEnter()}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Description</span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          placeholder={'description'}
          value={description}
          onChange={e => setDescription(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleEnter()}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Expires in</span>
          <span className="text-muted-foreground mx-2 ml-4">
            {formatSeconds(seconds) || ''}
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          placeholder={'seconds until expiration'}
          value={seconds && seconds > 0 ? seconds : ''}
          onChange={e => setSeconds(Number(e.target.value))}
          onKeyDown={e => e.key === 'Enter' && handleEnter()}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Include Private Channels</span>
        </div>
        <Switch checked={includePrivate} onCheckedChange={setIncludePrivate} />
      </div>
      <Button
        variant="outline"
        onClick={() => handleEnter()}
        disabled={amount === 0 || loading}
        style={{ margin: '16px 0 0' }}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>
            Create Invoice <ChevronRight size={18} />
          </>
        )}
      </Button>
    </>
  );

  return request !== '' ? renderQr() : renderContent();
};
