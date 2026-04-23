import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  ArrowDownToLine,
  ChevronLeft,
  Copy,
  ExternalLink,
  Gem,
  Loader2,
  Zap,
  Link as LinkIcon,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCreateAddressMutation } from '../../../../graphql/mutations/__generated__/createAddress.generated';
import { useCreateInvoiceMutation } from '../../../../graphql/mutations/__generated__/createInvoice.generated';
import { getErrorContent } from '../../../../utils/error';
import { Link } from '../../../../components/link/Link';
import { Price } from '../../../../components/price/Price';
import { formatSeconds } from '../../../../utils/helpers';
import { InvoiceStatus } from '../../account/createInvoice/InvoiceStatus';
import { Timer } from '../../account/createInvoice/Timer';
import { useGetNodeCapabilitiesQuery } from '../../../../graphql/queries/__generated__/getNodeCapabilities.generated';
import { CURRENCY_PROVIDERS, CurrencyProvider } from './currencyProviders';
import { TapDepositStep } from './TapDepositStep';

type Network = 'lightning' | 'onchain' | 'fiat-provider' | 'taproot-assets';

export const useDeposit = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openDeposit = () => setModalOpen(true);
  const closeDeposit = () => setModalOpen(false);

  return { openDeposit, modalOpen, closeDeposit };
};

export const DepositModal = ({
  modalOpen,
  closeDeposit,
}: {
  modalOpen: boolean;
  closeDeposit: () => void;
}) => (
  <Dialog open={modalOpen} onOpenChange={open => !open && closeDeposit()}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
            <ArrowDownToLine size={16} className="text-green-500" />
          </div>
          <div>
            <DialogTitle>Receive</DialogTitle>
            <DialogDescription>Receive to your node</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <DepositFlow />
    </DialogContent>
  </Dialog>
);

const DepositFlow = () => {
  const [network, setNetwork] = useState<Network | null>(null);
  const [provider, setProvider] = useState<CurrencyProvider | null>(null);

  const goBack = () => {
    setNetwork(null);
    setProvider(null);
  };

  if (!network) {
    return (
      <NetworkSelect
        onSelect={(n, p) => {
          setNetwork(n);
          if (p) setProvider(p);
        }}
      />
    );
  }

  if (network === 'lightning') {
    return <LightningInvoiceStep onBack={goBack} />;
  }

  if (network === 'onchain') {
    return <OnchainAddressStep onBack={goBack} />;
  }

  if (network === 'taproot-assets') {
    return <TapDepositStep onBack={goBack} />;
  }

  if (network === 'fiat-provider' && provider) {
    return <FiatDepositStep provider={provider} onBack={goBack} />;
  }

  return null;
};

const NetworkSelect = ({
  onSelect,
}: {
  onSelect: (n: Network, p?: CurrencyProvider) => void;
}) => {
  const { data: capData } = useGetNodeCapabilitiesQuery();
  const tapdAvailable =
    capData?.node?.capabilities?.list?.includes('taproot_assets') ?? false;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium text-muted-foreground">
        Select a method
      </span>
      <div className="grid gap-2">
        <button
          className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
          onClick={() => onSelect('lightning')}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
            <Zap size={16} className="text-yellow-500" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium">Lightning</div>
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                Instant
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                No minimum
              </span>
            </div>
          </div>
        </button>
        <button
          className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
          onClick={() => onSelect('onchain')}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
            <LinkIcon size={16} className="text-blue-500" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium">Onchain</div>
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                ~10 minutes
              </span>
            </div>
          </div>
        </button>
        {tapdAvailable && (
          <button
            className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
            onClick={() => onSelect('taproot-assets')}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
              <Gem size={16} className="text-purple-500" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium">Taproot Assets</div>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                  ~10 minutes
                </span>
                <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                  Multi-Asset
                </span>
              </div>
            </div>
          </button>
        )}
        {CURRENCY_PROVIDERS.map(p => (
          <button
            key={p.id}
            className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
            onClick={() => onSelect('fiat-provider', p)}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
              {p.currencySymbol}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium">
                {p.currency} via {p.name}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                  Convert {p.currency} to BTC
                </span>
                <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                  Onchain
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    size="sm"
    className="self-start -ml-2"
    onClick={onClick}
  >
    <ChevronLeft size={14} />
    Back
  </Button>
);

const LightningInvoiceStep = ({ onBack }: { onBack: () => void }) => {
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
    if (!loading && data?.createInvoice) {
      setRequest(data.createInvoice.request);
      setId(data.createInvoice.id);
    }
  }, [data, loading]);

  if (invoiceStatus === 'paid') {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <Zap size={20} />
        </div>
        <span className="text-sm font-medium">Invoice Paid</span>
      </div>
    );
  }

  if (request) {
    return (
      <div className="flex flex-col gap-3">
        <BackButton onClick={onBack} />
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Invoice Created
          </span>
          <Timer initialMinute={1} initialSeconds={30} />
        </div>
        <InvoiceStatus id={id} callback={status => setInvoiceStatus(status)} />
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-lg bg-white p-3">
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

  const handleCreate = () => {
    if (amount === 0) return;
    createInvoice({
      variables: { amount, description, secondsUntil: seconds, includePrivate },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <BackButton onClick={onBack} />
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
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Description
        </label>
        <Input
          placeholder="Optional description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
      </div>
      <Separator />
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
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Include Private Channels
        </span>
        <Switch checked={includePrivate} onCheckedChange={setIncludePrivate} />
      </div>
      <Separator />
      <Button
        variant="outline"
        onClick={handleCreate}
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

const OnchainAddressStep = ({ onBack }: { onBack: () => void }) => {
  const [address, setAddress] = useState<string | null>(null);

  const [createAddress, { loading }] = useCreateAddressMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => setAddress(data.createAddress),
  });

  return (
    <div className="flex flex-col gap-3">
      <BackButton onClick={onBack} />
      {!address ? (
        <Button
          onClick={() => createAddress({ variables: { type: 'p2tr' } })}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            'Generate BTC Address'
          )}
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-lg bg-white p-3">
            <QRCodeSVG value={address} size={200} />
          </div>
          <div className="w-full break-all rounded border border-border px-3 py-2 text-center font-mono text-xs">
            {address}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigator.clipboard
                .writeText(address)
                .then(() => toast.success('Address Copied'))
            }
          >
            <Copy size={14} />
            Copy Address
          </Button>
        </div>
      )}
    </div>
  );
};

const FiatDepositStep = ({
  provider,
  onBack,
}: {
  provider: CurrencyProvider;
  onBack: () => void;
}) => {
  const [address, setAddress] = useState<string | null>(null);

  const [createAddress, { loading }] = useCreateAddressMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => setAddress(data.createAddress),
  });

  return (
    <div className="flex flex-col gap-3">
      <BackButton onClick={onBack} />
      <div className="w-full rounded border border-border bg-muted/30 p-3">
        <p className="mb-2 text-xs font-medium">
          How to deposit with {provider.name}:
        </p>
        <ol className="space-y-1 text-xs text-muted-foreground">
          <li>1. Generate a BTC address below</li>
          <li>2. Copy the address</li>
          <li>
            3. Open {provider.name} and follow the &quot;Connect&quot; flow
          </li>
          <li>4. BTC arrives on your node</li>
        </ol>
      </div>
      {!address ? (
        <Button
          onClick={() => createAddress({ variables: { type: 'p2tr' } })}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            'Generate BTC Address'
          )}
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-lg bg-white p-3">
            <QRCodeSVG value={address} size={200} />
          </div>
          <div className="w-full break-all rounded border border-border px-3 py-2 text-center font-mono text-xs">
            {address}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigator.clipboard
                .writeText(address)
                .then(() => toast.success('Address Copied'))
            }
          >
            <Copy size={14} />
            Copy Address
          </Button>
        </div>
      )}
      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <span>Don&apos;t have {provider.name}?</span>
        <Link href={provider.referralUrl} newTab>
          <span className="inline-flex items-center gap-0.5 text-primary hover:underline">
            Sign up <ExternalLink size={10} />
          </span>
        </Link>
      </div>
    </div>
  );
};
