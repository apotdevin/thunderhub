import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Cable,
  Check,
  Copy,
  Loader2,
  Zap,
  Wallet,
  Network,
  QrCode,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useOpenChannelMutation } from '../../graphql/mutations/__generated__/openChannel.generated';
import { useBitcoinFees } from '../../hooks/UseBitcoinFees';
import { getErrorContent } from '../../utils/error';
import { LITD_SETUP_DOCS_URL } from '../../utils/externalLinks';
import { cn } from '@/lib/utils';

type ReadinessData = {
  has_tapd: boolean;
  onchain_balance_sats: string;
  pending_onchain_balance_sats: string;
  deposit_address?: string | null;
  has_channel: boolean;
  has_active_channel: boolean;
  recommended_node?: { pubkey: string; sockets: string[] } | null;
};

type Props = {
  data: ReadinessData;
  refetch: () => void;
  loading?: boolean;
};

type StepStatus = 'done' | 'active' | 'locked';

const StepIcon: FC<{ status: StepStatus }> = ({ status }) => {
  if (status === 'done')
    return (
      <CheckCircle2 size={18} className="mt-0.5 text-green-500 shrink-0" />
    );
  if (status === 'active')
    return <Circle size={18} className="mt-0.5 text-primary shrink-0" />;
  return (
    <Circle size={18} className="mt-0.5 text-muted-foreground/30 shrink-0" />
  );
};

const MAX_CHANNEL_SIZE = 200_000;
const MIN_CHANNEL_SIZE = 100_000;

export const TradingReadiness: FC<Props> = ({ data, refetch, loading }) => {
  const [copied, setCopied] = useState(false);
  const [channelDialogOpen, setChannelDialogOpen] = useState(false);
  const [channelSize, setChannelSize] = useState('');
  const [fee, setFee] = useState(0);
  const [showCustom, setShowCustom] = useState(false);

  const { fast, halfHour, hour, dontShow: feesUnavailable } = useBitcoinFees();

  const depositAddress = data.deposit_address || null;

  const [openChannel, { loading: channelLoading }] = useOpenChannelMutation({
    onCompleted: () => {
      toast.success('Channel opening initiated');
      setChannelDialogOpen(false);
      refetch();
    },
    onError: err => toast.error(getErrorContent(err)),
  });

  const confirmedSats = Number(data.onchain_balance_sats) || 0;
  const pendingSats = Number(data.pending_onchain_balance_sats) || 0;
  const hasConfirmedFunds = confirmedSats > 0;
  const hasPendingFunds = pendingSats > 0;
  const availableSats = confirmedSats;
  const maxForChannel = Math.floor(availableSats * 0.5);
  const defaultChannelSize = Math.min(maxForChannel, MAX_CHANNEL_SIZE);
  const insufficientForChannel =
    hasConfirmedFunds && maxForChannel < MIN_CHANNEL_SIZE;

  const tapdStatus: StepStatus = data.has_tapd ? 'done' : 'active';
  const fundStatus: StepStatus = !data.has_tapd
    ? 'locked'
    : hasConfirmedFunds && !insufficientForChannel
      ? 'done'
      : 'active';
  const fundsPending = fundStatus === 'active' && hasPendingFunds;

  const channelStatus: StepStatus =
    !hasConfirmedFunds || insufficientForChannel
      ? 'locked'
      : data.has_active_channel
        ? 'done'
        : 'active';
  const channelPending =
    channelStatus === 'active' && data.has_channel && !data.has_active_channel;

  const handleCopy = () => {
    if (!depositAddress) return;
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChannel = () => {
    if (!data.recommended_node) return;
    const size = Number(channelSize) || defaultChannelSize;
    const feeRate = fee || fast;
    openChannel({
      variables: {
        input: {
          is_recommended: true,
          channel_size: Math.min(size, availableSats),
          ...(feeRate > 0 ? { chain_fee_tokens_per_vbyte: feeRate } : {}),
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Get Started</h2>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs gap-1.5"
          onClick={() => refetch()}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Complete these steps to start trading Taproot Assets.
      </p>

      {/* Step 1: Tapd */}
      <div
        className={cn(
          'flex gap-3 rounded-lg border p-4',
          tapdStatus === 'done'
            ? 'border-border/40 bg-muted/10'
            : 'border-border bg-background'
        )}
      >
        <StepIcon status={tapdStatus} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium">Taproot Assets daemon</span>
          </div>
          {tapdStatus === 'done' ? (
            <p className="text-xs text-muted-foreground mt-0.5">
              tapd is running and connected
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">
              Trading requires litd with tapd enabled.
            </p>
          )}
        </div>
        {tapdStatus !== 'done' && (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-8 shrink-0 gap-1.5 self-start"
          >
            <a
              href={LITD_SETUP_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Setup docs
              <ExternalLink size={12} />
            </a>
          </Button>
        )}
      </div>

      {/* Step 2: Fund wallet */}
      <div
        className={cn(
          'flex gap-3 rounded-lg border p-4',
          fundStatus === 'done'
            ? 'border-border/40 bg-muted/10'
            : fundStatus === 'locked'
              ? 'border-border/20 bg-muted/5 opacity-50'
              : 'border-border bg-background'
        )}
      >
        <StepIcon status={fundStatus} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Wallet size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium">Fund your wallet</span>
          </div>
          {fundStatus === 'done' ? (
            <p className="text-xs text-muted-foreground mt-1">
              {Number(data.onchain_balance_sats).toLocaleString()} sats
              available on-chain
            </p>
          ) : fundStatus === 'active' ? (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">
                Send Bitcoin to your node&apos;s on-chain wallet. These funds
                stay in your self-custody and are used to open channels. We
                recommend at least {(MIN_CHANNEL_SIZE * 2).toLocaleString()}{' '}
                sats for the best experience.
              </p>
              {depositAddress ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 cursor-pointer hover:bg-muted/80 transition-colors flex-1 min-w-0"
                      onClick={handleCopy}
                    >
                      <code className="text-xs truncate flex-1">
                        {depositAddress}
                      </code>
                      {copied ? (
                        <Check size={12} className="text-green-500" />
                      ) : (
                        <Copy size={12} className="text-muted-foreground" />
                      )}
                    </button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 shrink-0 p-0"
                        >
                          <QrCode size={14} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="max-w-xs"
                        aria-describedby={undefined}
                      >
                        <DialogHeader>
                          <DialogTitle>Deposit Address</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-2">
                          <div className="rounded-lg bg-white p-4">
                            <QRCodeSVG value={depositAddress} size={200} />
                          </div>
                          <button
                            type="button"
                            className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 cursor-pointer hover:bg-muted/80 transition-colors w-full"
                            onClick={handleCopy}
                          >
                            <code className="text-xs break-all flex-1">
                              {depositAddress}
                            </code>
                            {copied ? (
                              <Check size={12} className="text-green-500" />
                            ) : (
                              <Copy
                                size={12}
                                className="text-muted-foreground"
                              />
                            )}
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {copied && (
                    <span className="text-[10px] text-green-500">
                      Copied to clipboard
                    </span>
                  )}
                </div>
              ) : null}
              {fundsPending && (
                <div className="flex items-center gap-2 mt-2 text-xs text-yellow-500">
                  <Loader2 size={12} className="animate-spin" />
                  <span>
                    {pendingSats.toLocaleString()} sats incoming — waiting for
                    confirmation
                  </span>
                </div>
              )}
              {insufficientForChannel && (
                <div className="mt-2 inline-block rounded-md border border-yellow-500/30 bg-yellow-500/5 px-3 py-2 text-xs text-yellow-600">
                  Your balance of {confirmedSats.toLocaleString()} sats is low.
                  We recommend depositing at least{' '}
                  {(MIN_CHANNEL_SIZE * 2).toLocaleString()} sats for the best
                  experience.
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">
              Complete the previous step first
            </p>
          )}
        </div>
      </div>

      {/* Step 3: Open channel */}
      <div
        className={cn(
          'flex gap-3 rounded-lg border p-4',
          channelStatus === 'done'
            ? 'border-border/40 bg-muted/10'
            : channelStatus === 'locked'
              ? 'border-border/20 bg-muted/5 opacity-50'
              : 'border-border bg-background'
        )}
      >
        <StepIcon status={channelStatus} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Network size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium">Connect to network</span>
          </div>
          {channelStatus === 'done' ? (
            <p className="text-xs text-muted-foreground mt-0.5">
              Connected to the Lightning Network
            </p>
          ) : channelPending ? (
            <div className="flex items-center gap-2 mt-0.5 text-xs text-yellow-500">
              <Loader2 size={12} className="animate-spin" />
              Channel opening — waiting for on-chain confirmation
            </div>
          ) : channelStatus === 'active' ? (
            <p className="text-xs text-muted-foreground mt-0.5">
              Open a channel to join the Rails network.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">
              Complete the previous step first
            </p>
          )}
        </div>
        {channelStatus === 'active' &&
          !channelPending &&
          data.recommended_node && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 shrink-0 gap-1.5 self-start"
              onClick={() => {
                setChannelSize(String(defaultChannelSize));
                setFee(fast);
                setShowCustom(false);
                setChannelDialogOpen(true);
              }}
            >
              <Cable size={12} />
              Open channel
            </Button>
          )}
      </div>

      {/* Channel size dialog */}
      <Dialog open={channelDialogOpen} onOpenChange={setChannelDialogOpen}>
        <DialogContent className="max-w-xs" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Open Channel</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <p className="text-sm text-muted-foreground">
              Open a channel to a Rails node to connect to the Lightning
              Network.
            </p>

            {/* Summary */}
            <div className="flex flex-col gap-1 rounded-md border border-border/60 bg-muted/20 px-3 py-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size</span>
                <span className="tabular-nums">
                  {Number(channelSize || 0).toLocaleString()} sats
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee rate</span>
                <span className="tabular-nums">{fee || fast} sat/vB</span>
              </div>
            </div>

            {/* Customize toggle */}
            <button
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowCustom(c => !c)}
            >
              <Settings size={11} />
              {showCustom ? 'Hide options' : 'Customize'}
            </button>

            {showCustom && (
              <div className="flex flex-col gap-3 rounded-md border border-border/60 p-3">
                {/* Size input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Channel size
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={channelSize}
                      onChange={e => {
                        const v = e.target.value.replace(/[^0-9]/g, '');
                        setChannelSize(v);
                      }}
                      className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm pr-14 tabular-nums"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      sats
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Available: {availableSats.toLocaleString()} sats
                  </p>
                </div>

                {/* Fee selector */}
                {!feesUnavailable && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      On-chain fee
                    </label>
                    <div className="flex gap-1">
                      {[
                        { label: 'Fast', rate: fast },
                        { label: '30m', rate: halfHour },
                        { label: '1h', rate: hour },
                      ]
                        .filter(
                          (f, i, arr) =>
                            arr.findIndex(x => x.rate === f.rate) === i
                        )
                        .map(f => (
                          <button
                            key={f.label}
                            onClick={() => setFee(f.rate)}
                            className={cn(
                              'flex-1 rounded-md border px-2 py-1 text-[11px] transition-colors',
                              fee === f.rate
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {f.label}
                            <span className="block text-[9px] tabular-nums opacity-70">
                              {f.rate} sat/vB
                            </span>
                          </button>
                        ))}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={fee}
                        onChange={e => {
                          const v = e.target.value.replace(/[^0-9]/g, '');
                          setFee(Number(v) || 0);
                        }}
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm pr-16 tabular-nums"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        sat/vB
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleOpenChannel}
              disabled={
                channelLoading ||
                !channelSize ||
                Number(channelSize) <= 0 ||
                Number(channelSize) > availableSats ||
                (fee || fast) <= 0
              }
            >
              {channelLoading ? (
                <>
                  <Loader2 size={14} className="mr-1.5 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <Cable size={14} className="mr-1.5" />
                  Open channel
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
