import { FC, useEffect, useState } from 'react';
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
import { useOpenChannelMutation } from '../../graphql/mutations/__generated__/openChannel.generated';
import { useExecuteTradeMutation } from '../../graphql/mutations/__generated__/executeTrade.generated';
import { useGetPeerChannelsQuery } from '../../graphql/queries/__generated__/getPeerChannels.generated';
import { useGetTapAssetChannelBalancesQuery } from '../../graphql/queries/__generated__/getTapAssetChannelBalances.generated';
import { useGetTradeQuoteLazyQuery } from '../../graphql/queries/__generated__/getTradeQuote.generated';
import { getErrorContent } from '../../utils/error';
import {
  atomicToDisplay,
  displayAssetToSats,
  displayToAtomic,
} from './trade.helpers';

export type Offer = {
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
  tapdGroupKey: string;
  assetSymbol: string;
  assetPrecision: number;
  transactionType: TapTransactionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const TradeSheet: FC<TradeSheetProps> = ({
  offer,
  assetId,
  tapdAssetId,
  tapdGroupKey,
  assetSymbol,
  assetPrecision,
  transactionType,
  open,
  onOpenChange,
}) => {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [quotedSats, setQuotedSats] = useState<string | null>(null);
  const [quotePaymentRequest, setQuotePaymentRequest] = useState<string | null>(
    null
  );
  const [quoteRfqId, setQuoteRfqId] = useState<string | null>(null);
  const [quoteExpiry, setQuoteExpiry] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const [openChannel, { loading: openChannelLoading }] = useOpenChannelMutation(
    {
      onCompleted: () => {
        toast.success('Outbound channel opened successfully');
        onOpenChange(false);
        setAmount('');
        setStep('input');
      },
      onError: err => toast.error(getErrorContent(err)),
    }
  );

  const [setupPartner, { loading: setupLoading }] =
    useSetupTradePartnerMutation({
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
          setQuotedSats(null);
          setQuotePaymentRequest(null);
          setQuoteRfqId(null);
          setQuoteExpiry(null);
        }
      },
      onError: err => toast.error(getErrorContent(err)),
    });

  const [executeTrade, { loading: tradeLoading }] = useExecuteTradeMutation({
    onCompleted: data => {
      const result = data.executeTrade;
      if (result.success) {
        const satsInfo = result.satsAmount
          ? ` for ${Number(result.satsAmount).toLocaleString()} sats`
          : '';
        const feeLabel = result.feeSats
          ? ` (fee: ${Number(result.feeSats).toLocaleString()} sats)`
          : '';
        toast.success(`Trade executed successfully${satsInfo}${feeLabel}`);
        onOpenChange(false);
        setAmount('');
        setStep('input');
        setQuotedSats(null);
        setQuotePaymentRequest(null);
        setQuoteRfqId(null);
        setQuoteExpiry(null);
      } else {
        toast.error('Trade did not complete — please try again');
        setStep('input');
      }
    },
    onError: err => toast.error(getErrorContent(err)),
  });

  const [fetchQuote, { loading: quoteLoading }] = useGetTradeQuoteLazyQuery({
    fetchPolicy: 'network-only',
  });

  // Countdown timer for quote expiry
  useEffect(() => {
    if (quoteExpiry == null) {
      setSecondsLeft(null);
      return;
    }
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor(quoteExpiry - Date.now() / 1000)
      );
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        setQuotedSats(null);
        setQuotePaymentRequest(null);
        setQuoteRfqId(null);
        setQuoteExpiry(null);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [quoteExpiry]);

  const quoteExpired = secondsLeft != null && secondsLeft <= 0;

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

  const isAssetPurchase = transactionType === TapTransactionType.Purchase;
  const nodeLabel = offer.node.alias || offer.node.pubkey?.slice(0, 16);
  const rateDisplay = offer.rate.displayAmount || offer.rate.fullAmount;
  const availableDisplay =
    offer.available.displayAmount || offer.available.fullAmount;
  const rate = offer.rate.fullAmount || '0';

  const peerChannels = channelsData?.getChannels || [];
  const allAssetChannels = assetChannelsData?.getTapAssetChannelBalances || [];
  // When tapdAssetId is empty (grouped asset), all returned channels belong to
  // the correct peer — the query already scopes by peerPubkey.
  const assetChannels = tapdAssetId
    ? allAssetChannels.filter(ac => ac.assetId === tapdAssetId)
    : allAssetChannels;

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

  const isValid = amount && BigInt(amount) > 0n;

  // Determine input mode from raw capacity to avoid circular dependency.
  // When buying with existing asset inbound but no BTC outbound, the user
  // opens a direct BTC channel (amount = sats) instead of a Magma order.
  const needsOnlyOutboundBtc =
    isAssetPurchase && totalAssetRemote > BigInt(0) && !(totalBtcLocal > 0);

  // Input is asset display units unless needsOnlyOutboundBtc (sats directly).
  // rate is in atomic-asset-units per BTC (full_amount from trade API)
  const satsAmount =
    isValid && !needsOnlyOutboundBtc
      ? displayAssetToSats(amount, rate, assetPrecision)
      : '0';

  const atomicTradeAmount =
    isValid && !needsOnlyOutboundBtc
      ? displayToAtomic(amount, assetPrecision)
      : BigInt(0);

  // Amount-aware capacity checks: passes only if existing channels cover the
  // requested trade size. Falls back to > 0 when no amount has been entered.
  const hasOutbound = needsOnlyOutboundBtc
    ? false
    : isValid
      ? isAssetPurchase
        ? totalBtcLocal >= Number(satsAmount)
        : totalAssetLocal >= atomicTradeAmount
      : isAssetPurchase
        ? totalBtcLocal > 0
        : totalAssetLocal > BigInt(0);

  const hasInbound = needsOnlyOutboundBtc
    ? true
    : isValid
      ? isAssetPurchase
        ? totalAssetRemote >= atomicTradeAmount
        : totalBtcRemote >= Number(satsAmount)
      : isAssetPurchase
        ? totalAssetRemote > BigInt(0)
        : totalBtcRemote > 0;

  const readyToTrade = hasOutbound && hasInbound;
  const loading = openChannelLoading || setupLoading || tradeLoading;
  const hasRate = !!rate && rate !== '0';

  const displaySats = quotedSats || (hasRate ? satsAmount : null);
  const satsLabel = displaySats
    ? `${Number(displaySats).toLocaleString()} sats`
    : 'fetching quote...';
  const sendLabel = isAssetPurchase ? satsLabel : `${amount} ${assetSymbol}`;
  const receiveLabel = isAssetPurchase ? `${amount} ${assetSymbol}` : satsLabel;

  // For channel setup: BUY outbound = BTC (sats), magma inbound = asset
  // SELL outbound = asset, magma inbound = BTC (sats)
  const outboundSize = isAssetPurchase ? satsAmount : amount;
  const outboundUnit = isAssetPurchase ? 'sats' : assetSymbol;
  const magmaSize = isAssetPurchase ? amount : satsAmount;
  const magmaUnit = isAssetPurchase ? assetSymbol : 'sats';

  const handleSubmit = () => {
    if (!amount || !offer.node.pubkey) return;

    if (needsOnlyOutboundBtc) {
      openChannel({
        variables: {
          input: {
            partner_public_key: offer.node.pubkey,
            channel_size: Number(amount),
          },
        },
      });
      return;
    }

    if (!offer.magmaOfferId) {
      toast.error(
        'Channel setup requires a Magma offer — select a peer from the offers list'
      );
      return;
    }

    // hasOutbound && !hasInbound && isAssetPurchase: skip channel opening, pass atomic
    // asset units directly to avoid sats round-trip rounding errors.
    const magmaOnlyBuy =
      isAssetPurchase && hasInbound === false && hasOutbound === true;

    setupPartner({
      variables: {
        input: {
          magmaOfferId: offer.magmaOfferId,
          assetId,
          amount: magmaOnlyBuy
            ? atomicTradeAmount.toString()
            : isAssetPurchase
              ? satsAmount
              : amount,
          assetRate: rate,
          assetPrecision,
          transactionType,
          swapNodePubkey: offer.node.pubkey,
          swapNodeSockets: offer.node.sockets,
          tapdAssetId: tapdAssetId || undefined,
          tapdGroupKey: tapdGroupKey || undefined,
          skipOutboundChannel: magmaOnlyBuy || undefined,
        },
      },
    });
  };

  const handleReviewTrade = async () => {
    if (!amount || !offer.node.pubkey) return;
    setQuotedSats(null);
    setQuotePaymentRequest(null);
    setQuoteRfqId(null);
    setQuoteExpiry(null);
    const assetAtomicAmount = String(displayToAtomic(amount, assetPrecision));
    const { data, error } = await fetchQuote({
      variables: {
        input: {
          tapdAssetId,
          tapdGroupKey: tapdGroupKey || undefined,
          assetAmount: assetAtomicAmount,
          transactionType,
          peerPubkey: offer.node.pubkey,
        },
      },
    });
    if (error) {
      toast.error(getErrorContent(error));
      return;
    }
    const quote = data?.getTradeQuote;
    const quotedAmount = quote?.satsAmount;
    if (!quotedAmount || quotedAmount === '0') {
      toast.error(
        'Could not get a valid quote from the peer — please try again'
      );
      return;
    }
    setQuotedSats(quotedAmount);
    setQuotePaymentRequest(quote?.paymentRequest || null);
    setQuoteRfqId(quote?.rfqId || null);
    if (quote?.expiryEpoch) {
      setQuoteExpiry(Number(quote.expiryEpoch));
    }
    setStep('confirm');
  };

  const handleTrade = () => {
    if (!amount || !offer.node.pubkey) return;
    if (!displaySats || displaySats === '0') {
      toast.error('No valid quote available — please go back and try again');
      return;
    }
    const assetAtomicAmount = String(displayToAtomic(amount, assetPrecision));
    executeTrade({
      variables: {
        input: {
          tapdAssetId,
          tapdGroupKey: tapdGroupKey || undefined,
          assetAmount: assetAtomicAmount,
          satsAmount: displaySats,
          transactionType,
          peerPubkey: offer.node.pubkey,
          paymentRequest: quotePaymentRequest || undefined,
          rfqId: quoteRfqId || undefined,
        },
      },
    });
  };

  const clearQuoteState = () => {
    setQuotedSats(null);
    setQuotePaymentRequest(null);
    setQuoteRfqId(null);
    setQuoteExpiry(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStep('input');
      setAmount('');
      clearQuoteState();
    }
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-[360px] sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle>
            {isAssetPurchase ? 'Buy' : 'Sell'} {assetSymbol}
          </SheetTitle>
          <SheetDescription>
            {step === 'input'
              ? readyToTrade
                ? `Trade with ${nodeLabel}`
                : needsOnlyOutboundBtc
                  ? `Open outbound BTC channel to ${nodeLabel}`
                  : `Set up trading channels with ${nodeLabel}`
              : readyToTrade
                ? 'Review trade before executing'
                : needsOnlyOutboundBtc
                  ? 'Review BTC channel before opening'
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
                      Outbound ({isAssetPurchase ? 'BTC' : assetSymbol})
                      {hasOutbound ? (
                        <span className="text-muted-foreground ml-1">
                          {isAssetPurchase
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
                      Inbound ({isAssetPurchase ? assetSymbol : 'BTC'})
                      {hasInbound ? (
                        <span className="text-muted-foreground ml-1">
                          {isAssetPurchase
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
                {needsOnlyOutboundBtc
                  ? 'Channel size (sats)'
                  : `Amount (${assetSymbol})`}
              </label>
              <div className="relative">
                <input
                  id="trade-amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={e => {
                    const v = e.target.value.replace(/[^0-9.]/g, '');
                    // Allow only one decimal point
                    const parts = v.split('.');
                    setAmount(
                      parts.length > 2
                        ? `${parts[0]}.${parts.slice(1).join('')}`
                        : v
                    );
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {needsOnlyOutboundBtc ? 'sats' : assetSymbol}
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

            {readyToTrade ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trade summary</span>
                  {secondsLeft != null && secondsLeft > 0 && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      Quote expires in {secondsLeft}s
                    </span>
                  )}
                </div>
                {quoteExpired ? (
                  <div className="rounded-md border border-yellow-500/20 bg-yellow-500/5 p-3 text-sm text-yellow-600">
                    Quote expired — go back and request a new quote
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="rounded-md border border-border bg-muted/20 p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span className="font-medium text-foreground">
                          You send
                        </span>
                      </div>
                      <div className="text-sm font-mono ml-5.5">
                        {sendLabel}
                      </div>
                    </div>
                    <div className="rounded-md border border-border bg-muted/20 p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span className="font-medium text-foreground">
                          You receive
                        </span>
                      </div>
                      <div className="text-sm font-mono ml-5.5">
                        {receiveLabel}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : needsOnlyOutboundBtc ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Channel to open</span>
                <div className="rounded-md border border-border bg-muted/20 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">
                      Outbound BTC channel
                    </span>
                  </div>
                  <div className="text-sm font-mono ml-5.5">
                    {Number(amount).toLocaleString()} sats
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Channels to open</span>
                <div className="flex flex-col gap-2">
                  {!hasOutbound && (
                    <div className="rounded-md border border-border bg-muted/20 p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span className="font-medium text-foreground">
                          Outbound {isAssetPurchase ? 'BTC' : assetSymbol}{' '}
                          channel
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
                          Inbound {isAssetPurchase ? assetSymbol : 'BTC'}{' '}
                          channel (Magma)
                        </span>
                      </div>
                      <div className="text-sm font-mono ml-5.5">
                        {Number(magmaSize).toLocaleString()} {magmaUnit}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <SheetFooter className="flex gap-2">
          {step === 'input' && (
            <Button
              onClick={
                readyToTrade ? handleReviewTrade : () => setStep('confirm')
              }
              disabled={
                !isValid ||
                (!readyToTrade && !needsOnlyOutboundBtc && !offer.magmaOfferId)
              }
              className="w-full"
            >
              {readyToTrade
                ? 'Review Trade'
                : needsOnlyOutboundBtc
                  ? 'Review Channel'
                  : !offer.magmaOfferId
                    ? 'No offer available for setup'
                    : 'Review Setup'}
            </Button>
          )}
          {step === 'confirm' && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setStep('input');
                  clearQuoteState();
                }}
                disabled={loading}
                className="flex-1"
              >
                Back
              </Button>
              {readyToTrade ? (
                <Button
                  onClick={handleTrade}
                  disabled={
                    loading || quoteLoading || !displaySats || quoteExpired
                  }
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Trading...
                    </>
                  ) : quoteLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting quote...
                    </>
                  ) : (
                    'Execute Trade'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {needsOnlyOutboundBtc ? 'Opening...' : 'Setting up...'}
                    </>
                  ) : needsOnlyOutboundBtc ? (
                    'Open Channel'
                  ) : (
                    'Confirm'
                  )}
                </Button>
              )}
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
