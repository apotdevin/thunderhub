import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { TapTransactionType } from '../../graphql/types';
import { useSetupTradePartnerMutation } from '../../graphql/mutations/__generated__/setupTradePartner.generated';
import { useGetPeerChannelsQuery } from '../../graphql/queries/__generated__/getPeerChannels.generated';
import { useGetTapAssetChannelBalancesQuery } from '../../graphql/queries/__generated__/getTapAssetChannelBalances.generated';
import { getErrorContent } from '../../utils/error';

type Offer = {
  id: string;
  magmaOfferId: string;
  node: { alias?: string | null; pubkey?: string | null; sockets: string[] };
  rate: { displayAmount?: string | null; fullAmount?: string | null };
  available: { displayAmount?: string | null; fullAmount?: string | null };
};

type TradeSheetProps = {
  offer: Offer | null;
  assetId: string;
  tapdAssetId: string;
  assetSymbol: string;
  assetPrecision: number;
  transactionType: TapTransactionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Converts display asset units to sats using the atomic rate
const displayAssetToSats = (
  displayAmount: string,
  rate: string,
  precision: number
): string => {
  if (!rate || rate === '0') return '0';
  const multiplier = BigInt(10 ** precision);
  return (
    (BigInt(displayAmount) * multiplier * BigInt(100_000_000)) /
    BigInt(rate)
  ).toString();
};

const atomicToDisplay = (atomic: string, precision: number): string => {
  if (precision === 0) return atomic;
  const divisor = 10 ** precision;
  return (Number(atomic) / divisor).toFixed(precision);
};

export const TradeSheet: FC<TradeSheetProps> = ({
  offer,
  assetId,
  tapdAssetId,
  assetSymbol,
  assetPrecision,
  transactionType,
  open,
  onOpenChange,
}) => {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm'>('input');

  const [setupPartner, { loading }] = useSetupTradePartnerMutation({
    onCompleted: data => {
      const result = data.setupTradePartner;
      if (result.success) {
        const amountLabel = result.magmaOrderAmountAsset
          ? `${atomicToDisplay(result.magmaOrderAmountAsset, assetPrecision)} ${assetSymbol}`
          : result.magmaOrderAmountSats
            ? `${Number(result.magmaOrderAmountSats).toLocaleString()} sats`
            : '';
        const feeLabel = result.magmaOrderFeeSats
          ? ` (fee: ${Number(result.magmaOrderFeeSats).toLocaleString()} sats)`
          : '';
        toast.success(
          amountLabel
            ? `Trade channels set up — ${amountLabel}${feeLabel}`
            : 'Trade partner channels set up successfully'
        );
        onOpenChange(false);
        setAmount('');
        setStep('input');
      }
    },
    onError: err => toast.error(getErrorContent(err)),
  });

  const { data: channelsData, loading: channelsLoading } =
    useGetPeerChannelsQuery({
      variables: { partner_public_key: offer?.node.pubkey || '' },
      skip: !offer?.node.pubkey || !open,
    });

  const { data: assetChannelsData } = useGetTapAssetChannelBalancesQuery({
    variables: { peerPubkey: offer?.node.pubkey || '' },
    skip: !offer?.node.pubkey || !open,
  });

  if (!offer) return null;

  const isBuy = transactionType === TapTransactionType.Purchase;
  const nodeLabel = offer.node.alias || offer.node.pubkey?.slice(0, 16);
  const rateDisplay = offer.rate.displayAmount || offer.rate.fullAmount;
  const availableDisplay =
    offer.available.displayAmount || offer.available.fullAmount;
  const rate = offer.rate.fullAmount || '0';

  const peerChannels = channelsData?.getChannels || [];
  const allAssetChannels = assetChannelsData?.getTapAssetChannelBalances || [];
  const assetChannels = allAssetChannels.filter(
    ac => ac.assetId === tapdAssetId
  );

  const assetChannelPoints = new Set(
    allAssetChannels.map(ac => ac.channelPoint)
  );

  const btcOnlyChannels = peerChannels.filter(
    ch => !assetChannelPoints.has(`${ch.transaction_id}:${ch.transaction_vout}`)
  );

  const totalBtcLocal = btcOnlyChannels.reduce(
    (sum, ch) => sum + ch.local_balance,
    0
  );
  const totalAssetLocal = assetChannels.reduce(
    (sum, ac) => sum + BigInt(ac.localBalance),
    BigInt(0)
  );
  const totalAssetRemote = assetChannels.reduce(
    (sum, ac) => sum + BigInt(ac.remoteBalance),
    BigInt(0)
  );
  const totalBtcRemote = btcOnlyChannels.reduce(
    (sum, ch) => sum + ch.remote_balance,
    0
  );

  const hasOutbound = isBuy ? totalBtcLocal > 0 : totalAssetLocal > BigInt(0);
  const hasInbound = isBuy ? totalAssetRemote > BigInt(0) : totalBtcRemote > 0;

  const isValid = amount && Number(amount) > 0;

  // Input is always in asset display units
  // rate is in atomic-asset-units per BTC (full_amount from trade API)
  const satsAmount = isValid
    ? displayAssetToSats(amount, rate, assetPrecision)
    : '0';

  // For channel setup: BUY outbound = BTC (sats), magma inbound = asset
  // SELL outbound = asset, magma inbound = BTC (sats)
  const outboundSize = isBuy ? satsAmount : amount;
  const outboundUnit = isBuy ? 'sats' : assetSymbol;
  const magmaSize = isBuy ? amount : satsAmount;
  const magmaUnit = isBuy ? assetSymbol : 'sats';

  const handleSubmit = () => {
    if (!amount || !offer.node.pubkey) return;

    setupPartner({
      variables: {
        input: {
          magmaOfferId: offer.magmaOfferId,
          assetId,
          amount: isBuy ? satsAmount : amount,
          assetRate: rate,
          assetPrecision,
          transactionType,
          swapNodePubkey: offer.node.pubkey,
          swapNodeSockets: offer.node.sockets,
        },
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStep('input');
      setAmount('');
    }
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-[360px] sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle>
            {isBuy ? 'Buy' : 'Sell'} {assetSymbol}
          </SheetTitle>
          <SheetDescription>
            {step === 'input'
              ? `Set up trading channels with ${nodeLabel}`
              : 'Review channel setup before proceeding'}
          </SheetDescription>
        </SheetHeader>

        {step === 'input' && (
          <div className="flex flex-col gap-4 p-4 flex-1">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Node</span>
                <span className="font-mono text-xs">{nodeLabel}</span>
              </div>
              {rateDisplay && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate</span>
                  <span>
                    {rateDisplay} {assetSymbol}/BTC
                  </span>
                </div>
              )}
              {availableDisplay && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span>
                    {Number(availableDisplay).toLocaleString()} {assetSymbol}
                  </span>
                </div>
              )}
            </div>

            {/* Existing channels with peer */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Existing channels</span>
              {channelsLoading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Checking channels...
                </div>
              ) : btcOnlyChannels.length === 0 && assetChannels.length === 0 ? (
                <div className="text-xs text-muted-foreground">
                  No channels with this node
                </div>
              ) : (
                <div className="flex flex-col gap-1 text-xs">
                  {btcOnlyChannels.map(ch => (
                    <div
                      key={ch.id}
                      className="flex justify-between rounded-md border border-border bg-muted/20 px-2 py-1.5"
                    >
                      <span className="text-muted-foreground">
                        {Number(ch.capacity).toLocaleString()} sats
                      </span>
                      <span>
                        {Number(ch.local_balance).toLocaleString()} /{' '}
                        {Number(ch.remote_balance).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {assetChannels.map(ac => (
                    <div
                      key={ac.channelPoint}
                      className="flex justify-between rounded-md border border-border bg-muted/20 px-2 py-1.5"
                    >
                      <span className="text-muted-foreground">
                        {atomicToDisplay(ac.capacity, assetPrecision)}{' '}
                        {assetSymbol}
                      </span>
                      <span>
                        {atomicToDisplay(ac.localBalance, assetPrecision)} /{' '}
                        {atomicToDisplay(ac.remoteBalance, assetPrecision)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Channel status */}
            {!channelsLoading && (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Channel status</span>
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    {hasOutbound ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
                    )}
                    <span>
                      Outbound ({isBuy ? 'BTC' : assetSymbol})
                      {hasOutbound ? (
                        <span className="text-muted-foreground ml-1">
                          {isBuy
                            ? `${totalBtcLocal.toLocaleString()} sats`
                            : `${atomicToDisplay(totalAssetLocal.toString(), assetPrecision)} ${assetSymbol}`}
                        </span>
                      ) : (
                        <span className="text-yellow-500 ml-1">missing</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasInbound ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
                    )}
                    <span>
                      Inbound ({isBuy ? assetSymbol : 'BTC'})
                      {hasInbound ? (
                        <span className="text-muted-foreground ml-1">
                          {isBuy
                            ? `${atomicToDisplay(totalAssetRemote.toString(), assetPrecision)} ${assetSymbol}`
                            : `${totalBtcRemote.toLocaleString()} sats`}
                        </span>
                      ) : (
                        <span className="text-yellow-500 ml-1">
                          missing — will be purchased via Magma
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="trade-amount"
                className="text-sm text-muted-foreground"
              >
                Amount ({assetSymbol})
              </label>
              <div className="relative">
                <input
                  id="trade-amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={e =>
                    setAmount(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {assetSymbol}
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="flex flex-col gap-4 p-4 flex-1">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Node</span>
                <span className="font-mono text-xs">{nodeLabel}</span>
              </div>
              {rateDisplay && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate</span>
                  <span>
                    {rateDisplay} {assetSymbol}/BTC
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Channels to open</span>
              <div className="flex flex-col gap-2">
                {!hasOutbound && (
                  <div className="rounded-md border border-border bg-muted/20 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span className="font-medium text-foreground">
                        Outbound {isBuy ? 'BTC' : assetSymbol} channel
                      </span>
                    </div>
                    <div className="text-sm font-mono ml-5.5">
                      {Number(outboundSize).toLocaleString()} {outboundUnit}
                    </div>
                  </div>
                )}
                {!hasInbound && (
                  <div className="rounded-md border border-border bg-muted/20 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span className="font-medium text-foreground">
                        Inbound {isBuy ? assetSymbol : 'BTC'} channel (Magma)
                      </span>
                    </div>
                    <div className="text-sm font-mono ml-5.5">
                      {Number(magmaSize).toLocaleString()} {magmaUnit}
                    </div>
                  </div>
                )}
                {hasOutbound && hasInbound && (
                  <div className="rounded-md border border-green-500/20 bg-green-500/5 p-3 text-sm">
                    Both channels already exist — ready to trade
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <SheetFooter className="flex gap-2">
          {step === 'input' && (
            <Button
              onClick={() => setStep('confirm')}
              disabled={!isValid}
              className="w-full"
            >
              Review Setup
            </Button>
          )}
          {step === 'confirm' && (
            <>
              <Button
                variant="outline"
                onClick={() => setStep('input')}
                disabled={loading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
