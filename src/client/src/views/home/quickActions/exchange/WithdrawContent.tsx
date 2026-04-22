import { useState, useEffect, useMemo } from 'react';
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
import {
  ArrowUpFromLine,
  ChevronLeft,
  ExternalLink,
  Loader2,
  Zap,
  Link as LinkIcon,
} from 'lucide-react';
import { useGetLightningAddressInfoLazyQuery } from '../../../../graphql/queries/__generated__/getLightningAddressInfo.generated';
import { usePayAddressMutation } from '../../../../graphql/mutations/__generated__/sendToAddress.generated';
import { usePayMutation } from '../../../../graphql/mutations/__generated__/pay.generated';
import { PayRequest } from '../../../../graphql/types';
import { LnPay } from '../lnurl/LnPay';
import { Price, getPrice } from '../../../../components/price/Price';
import { useBitcoinFees } from '../../../../hooks/UseBitcoinFees';
import { useConfigState } from '../../../../context/ConfigContext';
import { usePriceState } from '../../../../context/PriceContext';
import { getErrorContent } from '../../../../utils/error';
import { Link } from '../../../../components/link/Link';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ChannelSelect } from '../../../../components/select/specific/ChannelSelect';
import { decode } from 'light-bolt11-decoder';
import { CURRENCY_PROVIDERS, CurrencyProvider } from './currencyProviders';

type Network = 'lightning' | 'onchain' | 'fiat-provider';
type FiatStep = 'select-fiat-method' | 'enter-address' | 'pay';
type FiatMethod = 'lightning' | 'onchain';

export const useWithdraw = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openWithdraw = () => setModalOpen(true);
  const closeWithdraw = () => setModalOpen(false);

  return { openWithdraw, modalOpen, closeWithdraw };
};

export const WithdrawModal = ({
  modalOpen,
  closeWithdraw,
}: {
  modalOpen: boolean;
  closeWithdraw: () => void;
}) => (
  <Dialog open={modalOpen} onOpenChange={open => !open && closeWithdraw()}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10">
            <ArrowUpFromLine size={16} className="text-orange-500" />
          </div>
          <div>
            <DialogTitle>Withdraw</DialogTitle>
            <DialogDescription>Send BTC from your node</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <WithdrawFlow onClose={closeWithdraw} />
    </DialogContent>
  </Dialog>
);

const WithdrawFlow = ({ onClose }: { onClose: () => void }) => {
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
    return <PayInvoiceStep onBack={goBack} onClose={onClose} />;
  }

  if (network === 'onchain') {
    return <OnchainSendStep onBack={goBack} onClose={onClose} />;
  }

  if (network === 'fiat-provider' && provider) {
    return (
      <FiatWithdrawFlow provider={provider} onBack={goBack} onClose={onClose} />
    );
  }

  return null;
};

const NetworkSelect = ({
  onSelect,
}: {
  onSelect: (n: Network, p?: CurrencyProvider) => void;
}) => (
  <div className="flex flex-col gap-3">
    <span className="text-xs font-medium text-muted-foreground">
      Select a network
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
                Convert BTC to {p.currency}
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                Onchain
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                Lightning
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

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

const ReferralLink = ({ provider }: { provider: CurrencyProvider }) => (
  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
    <span>Don&apos;t have {provider.name}?</span>
    <Link href={provider.referralUrl} newTab>
      <span className="inline-flex items-center gap-0.5 text-primary hover:underline">
        Sign up <ExternalLink size={10} />
      </span>
    </Link>
  </div>
);

// --- Lightning: Pay Invoice ---

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
    const tokens = amount ? Math.floor(Number(amount) / 1000) : null;
    return { description, tokens };
  } catch {
    return null;
  }
};

const PayInvoiceStep = ({
  onBack,
  onClose,
}: {
  onBack: () => void;
  onClose: () => void;
}) => {
  const [request, setRequest] = useState('');
  const [peers, setPeers] = useState<string[]>([]);
  const [fee, setFee] = useState(100);
  const [paths, setPaths] = useState(10);
  const [confirming, setConfirming] = useState(false);

  const decoded = useMemo(() => getDecodedInvoice(request), [request]);

  const [pay, { loading }] = usePayMutation({
    onCompleted: () => {
      toast.success('Payment Sent');
      onClose();
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
      <BackButton onClick={onBack} />
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

      {decoded && (
        <div className="divide-y divide-border rounded border border-border text-xs">
          {decoded.description && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Description</span>
              <span className="font-medium">{decoded.description}</span>
            </div>
          )}
          {decoded.tokens !== null && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                <Price amount={decoded.tokens} />
              </span>
            </div>
          )}
        </div>
      )}

      <Separator />

      <div className="grid grid-cols-2 gap-3">
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
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Out Channels
        </label>
        <ChannelSelect callback={p => setPeers(p.map(peer => peer.id))} />
      </div>

      <Separator />

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

// --- Onchain: Send to address ---

const OnchainSendStep = ({
  onBack,
  onClose,
}: {
  onBack: () => void;
  onClose: () => void;
}) => {
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();
  const { currency, displayValues, fetchFees } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const [address, setAddress] = useState('');
  const [tokens, setTokens] = useState(0);
  const [type, setType] = useState(dontShow || !fetchFees ? 'fee' : 'none');
  const [amount, setAmount] = useState(0);
  const [sendAll, setSendAll] = useState(false);
  const [customFee, setCustomFee] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const canSend = address !== '' && (sendAll || tokens > 0) && amount > 0;

  const [payAddress, { loading }] = usePayAddressMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent!');
      onClose();
    },
    refetchQueries: ['GetNodeInfo', 'GetBalances'],
  });

  useEffect(() => {
    if (type === 'none' && amount === 0) {
      setAmount(fast);
    }
  }, [type, amount, fast]);

  const feeEstimate = () => {
    if (type === 'target') return <>(~{amount} blocks)</>;
    return <>(~{format({ amount: amount * 223 })})</>;
  };

  const typeAmount = () => {
    switch (type) {
      case 'none':
      case 'fee':
        return { fee: amount };
      case 'target':
        return { target: amount };
      default:
        return {};
    }
  };

  const tokenAmount = sendAll ? { sendAll } : { tokens };

  const feeSpeeds = [
    { label: 'Fastest', value: fast },
    ...(halfHour !== fast ? [{ label: '30 min', value: halfHour }] : []),
    ...(hour !== halfHour ? [{ label: '1 hour', value: hour }] : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      <BackButton onClick={onBack} />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Address
        </label>
        <Input
          value={address}
          placeholder="bc1..."
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Send All
        </span>
        <Switch checked={sendAll} onCheckedChange={setSendAll} />
      </div>

      {!sendAll && (
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
          />
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Fee Type
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={type}
          onValueChange={v => {
            if (!v) return;
            setType(v);
            setCustomFee(false);
            if (v === 'none') setAmount(fast);
            else setAmount(0);
          }}
        >
          {fetchFees && !dontShow && (
            <ToggleGroupItem value="none">Auto</ToggleGroupItem>
          )}
          <ToggleGroupItem value="fee">Fee</ToggleGroupItem>
          <ToggleGroupItem value="target">Target</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Fee Amount{' '}
            <span className="text-foreground/60">{feeEstimate()}</span>
            {!dontShow && (
              <Badge variant="secondary" className="ml-1.5 text-[10px]">
                min {minimum} sat/vB
              </Badge>
            )}
          </span>
        </div>

        {type === 'none' ? (
          <>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              className="w-full"
              value={customFee ? 'custom' : String(amount)}
              onValueChange={v => {
                if (!v) return;
                if (v === 'custom') {
                  setCustomFee(true);
                  setAmount(0);
                } else {
                  setCustomFee(false);
                  setAmount(Number(v));
                }
              }}
            >
              {feeSpeeds.map(s => (
                <ToggleGroupItem
                  key={s.value}
                  value={String(s.value)}
                  className="flex-1"
                >
                  {s.label} ({s.value})
                </ToggleGroupItem>
              ))}
              <ToggleGroupItem value="custom" className="flex-1">
                Custom
              </ToggleGroupItem>
            </ToggleGroup>
            {customFee && (
              <Input
                value={amount && amount > 0 ? amount : ''}
                placeholder="sats/vB"
                type="number"
                onChange={e => setAmount(Number(e.target.value))}
              />
            )}
          </>
        ) : (
          <Input
            value={amount && amount > 0 ? amount : ''}
            placeholder={type === 'target' ? 'Blocks' : 'sats/vB'}
            type="number"
            onChange={e => setAmount(Number(e.target.value))}
          />
        )}
      </div>

      {!confirming ? (
        <Button
          variant="outline"
          disabled={!canSend || loading}
          className="w-full"
          onClick={() => setConfirming(true)}
        >
          Send
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="divide-y divide-border rounded border border-border text-xs">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                {sendAll ? 'All' : <Price amount={tokens} />}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Address</span>
              <span className="max-w-50 truncate font-mono text-[11px] font-medium">
                {address}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-medium">
                {type === 'target' ? `${amount} blocks` : `${amount} sats/vB`}
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
              onClick={() =>
                payAddress({
                  variables: { address, ...typeAmount(), ...tokenAmount },
                })
              }
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

// --- Fiat: Bringin flow (Lightning Address or Onchain) ---

const FiatWithdrawFlow = ({
  provider,
  onBack,
  onClose,
}: {
  provider: CurrencyProvider;
  onBack: () => void;
  onClose: () => void;
}) => {
  const [step, setStep] = useState<FiatStep>('select-fiat-method');
  const [fiatMethod, setFiatMethod] = useState<FiatMethod | null>(null);
  const [payRequest, setPayRequest] = useState<PayRequest | null>(null);

  const goBack = () => {
    switch (step) {
      case 'select-fiat-method':
        onBack();
        break;
      case 'enter-address':
        setStep('select-fiat-method');
        break;
      case 'pay':
        setStep('enter-address');
        setPayRequest(null);
        break;
    }
  };

  if (step === 'select-fiat-method') {
    return (
      <div className="flex flex-col gap-3">
        <BackButton onClick={goBack} />
        <div className="grid gap-2">
          {provider.methods.includes('lightning') && (
            <button
              className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
              onClick={() => {
                setFiatMethod('lightning');
                setStep('enter-address');
              }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
                <Zap size={16} className="text-yellow-500" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium">Lightning</div>
                <div className="text-xs text-muted-foreground">
                  Send sats to a Lightning Address
                </div>
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                    Instant
                  </span>
                </div>
              </div>
            </button>
          )}
          {provider.methods.includes('onchain') && (
            <button
              className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
              onClick={() => {
                setFiatMethod('onchain');
                setStep('enter-address');
              }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                <LinkIcon size={16} className="text-blue-500" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium">Onchain</div>
                <div className="text-xs text-muted-foreground">
                  Send sats to a BTC address
                </div>
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                    ~10 minutes
                  </span>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'enter-address' && fiatMethod === 'lightning') {
    return (
      <FiatLightningAddressStep
        provider={provider}
        onBack={goBack}
        onPayRequest={pr => {
          setPayRequest(pr);
          setStep('pay');
        }}
      />
    );
  }

  if (step === 'enter-address' && fiatMethod === 'onchain') {
    return (
      <FiatOnchainSendStep
        provider={provider}
        onBack={goBack}
        onClose={onClose}
      />
    );
  }

  if (step === 'pay' && payRequest) {
    return (
      <div className="flex flex-col gap-3">
        <BackButton onClick={goBack} />
        <LnPay request={payRequest} hideTitle />
      </div>
    );
  }

  return null;
};

const FiatLightningAddressStep = ({
  provider,
  onBack,
  onPayRequest,
}: {
  provider: CurrencyProvider;
  onBack: () => void;
  onPayRequest: (pr: PayRequest) => void;
}) => {
  const [address, setAddress] = useState(
    () => localStorage.getItem(provider.localStorageKey) || ''
  );

  const [getInfo, { loading }] = useGetLightningAddressInfoLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: data => {
      localStorage.setItem(provider.localStorageKey, address);
      onPayRequest(data.getLightningAddressInfo);
    },
    onError: ({ graphQLErrors }) => {
      const messages = graphQLErrors.map(e => (
        <div key={e.message}>{e.message}</div>
      ));
      toast.error(<div>{messages}</div>);
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <BackButton onClick={onBack} />
      <div className="w-full rounded border border-border bg-muted/30 p-3">
        <p className="mb-2 text-xs font-medium">How to withdraw:</p>
        <ol className="space-y-1 text-xs text-muted-foreground">
          <li>
            1. Open {provider.name} and follow the &quot;Connect&quot; flow
          </li>
          <li>2. Copy the Lightning Address that {provider.name} provides</li>
          <li>3. Paste it below and continue</li>
        </ol>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          {provider.name} Lightning Address
        </label>
        <Input
          placeholder="user@bringin.xyz"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>
      <Button
        disabled={!address || loading}
        onClick={() => getInfo({ variables: { address } })}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Continue'}
      </Button>
      <Separator />
      <ReferralLink provider={provider} />
    </div>
  );
};

const FiatOnchainSendStep = ({
  provider,
  onBack,
  onClose,
}: {
  provider: CurrencyProvider;
  onBack: () => void;
  onClose: () => void;
}) => {
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();
  const { currency, displayValues, fetchFees } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const [address, setAddress] = useState('');
  const [tokens, setTokens] = useState(0);
  const [type, setType] = useState(dontShow || !fetchFees ? 'fee' : 'none');
  const [amount, setAmount] = useState(0);
  const [sendAll, setSendAll] = useState(false);
  const [customFee, setCustomFee] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const canSend = address !== '' && (sendAll || tokens > 0) && amount > 0;

  const [payAddress, { loading }] = usePayAddressMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent!');
      onClose();
    },
    refetchQueries: ['GetNodeInfo', 'GetBalances'],
  });

  useEffect(() => {
    if (type === 'none' && amount === 0) {
      setAmount(fast);
    }
  }, [type, amount, fast]);

  const feeEstimate = () => {
    if (type === 'target') return <>(~{amount} blocks)</>;
    return <>(~{format({ amount: amount * 223 })})</>;
  };

  const typeAmount = () => {
    switch (type) {
      case 'none':
      case 'fee':
        return { fee: amount };
      case 'target':
        return { target: amount };
      default:
        return {};
    }
  };

  const tokenAmount = sendAll ? { sendAll } : { tokens };

  const feeSpeeds = [
    { label: 'Fastest', value: fast },
    ...(halfHour !== fast ? [{ label: '30 min', value: halfHour }] : []),
    ...(hour !== halfHour ? [{ label: '1 hour', value: hour }] : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      <BackButton onClick={onBack} />

      <div className="w-full rounded border border-border bg-muted/30 p-3">
        <p className="mb-2 text-xs font-medium">How to withdraw:</p>
        <ol className="space-y-1 text-xs text-muted-foreground">
          <li>
            1. Open {provider.name} and follow the &quot;Connect&quot; flow
          </li>
          <li>2. Copy the BTC address that {provider.name} provides</li>
          <li>3. Paste it below and send your sats</li>
        </ol>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          {provider.name} BTC Address
        </label>
        <Input
          value={address}
          placeholder="bc1..."
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Send All
        </span>
        <Switch checked={sendAll} onCheckedChange={setSendAll} />
      </div>

      {!sendAll && (
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
          />
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Fee Type
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={type}
          onValueChange={v => {
            if (!v) return;
            setType(v);
            setCustomFee(false);
            if (v === 'none') setAmount(fast);
            else setAmount(0);
          }}
        >
          {fetchFees && !dontShow && (
            <ToggleGroupItem value="none">Auto</ToggleGroupItem>
          )}
          <ToggleGroupItem value="fee">Fee</ToggleGroupItem>
          <ToggleGroupItem value="target">Target</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Fee Amount{' '}
            <span className="text-foreground/60">{feeEstimate()}</span>
            {!dontShow && (
              <Badge variant="secondary" className="ml-1.5 text-[10px]">
                min {minimum} sat/vB
              </Badge>
            )}
          </span>
        </div>

        {type === 'none' ? (
          <>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              className="w-full"
              value={customFee ? 'custom' : String(amount)}
              onValueChange={v => {
                if (!v) return;
                if (v === 'custom') {
                  setCustomFee(true);
                  setAmount(0);
                } else {
                  setCustomFee(false);
                  setAmount(Number(v));
                }
              }}
            >
              {feeSpeeds.map(s => (
                <ToggleGroupItem
                  key={s.value}
                  value={String(s.value)}
                  className="flex-1"
                >
                  {s.label} ({s.value})
                </ToggleGroupItem>
              ))}
              <ToggleGroupItem value="custom" className="flex-1">
                Custom
              </ToggleGroupItem>
            </ToggleGroup>
            {customFee && (
              <Input
                value={amount && amount > 0 ? amount : ''}
                placeholder="sats/vB"
                type="number"
                onChange={e => setAmount(Number(e.target.value))}
              />
            )}
          </>
        ) : (
          <Input
            value={amount && amount > 0 ? amount : ''}
            placeholder={type === 'target' ? 'Blocks' : 'sats/vB'}
            type="number"
            onChange={e => setAmount(Number(e.target.value))}
          />
        )}
      </div>

      {!confirming ? (
        <Button
          variant="outline"
          disabled={!canSend || loading}
          className="w-full"
          onClick={() => setConfirming(true)}
        >
          Send
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="divide-y divide-border rounded border border-border text-xs">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                {sendAll ? 'All' : <Price amount={tokens} />}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Address</span>
              <span className="max-w-50 truncate font-mono text-[11px] font-medium">
                {address}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-medium">
                {type === 'target' ? `${amount} blocks` : `${amount} sats/vB`}
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
              onClick={() =>
                payAddress({
                  variables: { address, ...typeAmount(), ...tokenAmount },
                })
              }
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

      <Separator />
      <ReferralLink provider={provider} />
    </div>
  );
};
