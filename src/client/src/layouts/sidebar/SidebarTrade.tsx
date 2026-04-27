import { FC, useEffect, useState } from 'react';
import Big from 'big.js';
import toast from 'react-hot-toast';
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  RefreshCw,
} from 'lucide-react';
import { useQuery } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useTradingState,
  useTradingDispatch,
} from '../../context/TradingContext';
import { TapTransactionType } from '../../graphql/types';
import { useGetTradeQuoteLazyQuery } from '../../graphql/queries/__generated__/getTradeQuote.generated';
import { useExecuteTradeMutation } from '../../graphql/mutations/__generated__/executeTrade.generated';
import { useSetupTradeCapacityMutation } from '../../graphql/mutations/__generated__/setupTradeCapacity.generated';
import { GET_OFFER_READINESS } from '../../graphql/queries/getOfferReadiness';
import { getErrorContent } from '../../utils/error';
import { formatNumber } from '../../utils/helpers';
import {
  displayToAtomic,
  displayAssetToSats,
} from '../../views/assets/trade.helpers';

export const SidebarTrade: FC<{ embedded?: boolean }> = ({
  embedded = false,
}) => {
  const { selectedAsset, txType, selectedOffer } = useTradingState();
  const dispatch = useTradingDispatch();

  const [amount, setAmount] = useState('');
  const [quotedSats, setQuotedSats] = useState<string | null>(null);
  const [quotePaymentRequest, setQuotePaymentRequest] = useState<string | null>(
    null
  );
  const [quoteRfqId, setQuoteRfqId] = useState<string | null>(null);
  const [quoteExpiry, setQuoteExpiry] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const clearQuote = () => {
    setQuotedSats(null);
    setQuotePaymentRequest(null);
    setQuoteRfqId(null);
    setQuoteExpiry(null);
  };

  // Reset amount and quote when offer changes
  useEffect(() => {
    setAmount('');
    clearQuote();
  }, [selectedOffer?.id]);

  // Countdown timer
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
      if (remaining <= 0) clearQuote();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [quoteExpiry]);

  const [fetchQuote, { loading: quoteLoading }] = useGetTradeQuoteLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [executeTrade, { loading: tradeLoading }] = useExecuteTradeMutation({
    refetchQueries: ['GetTradeInvoices'],
    onCompleted: data => {
      const result = data.executeTrade;
      if (result.success) {
        const satsInfo = result.sats_amount
          ? ` for ${formatNumber(result.sats_amount)} sats`
          : '';
        const feeLabel = result.fee_sats
          ? ` (fee: ${formatNumber(result.fee_sats)} sats)`
          : '';
        toast.success(`Trade executed${satsInfo}${feeLabel}`);
        setAmount('');
        clearQuote();
        refetchReadiness();
      } else {
        toast.error('Trade did not complete — please try again');
        clearQuote();
      }
    },
    onError: err => {
      toast.error(getErrorContent(err));
      clearQuote();
    },
  });

  const [setupCapacity, { loading: setupLoading }] =
    useSetupTradeCapacityMutation({
      onCompleted: data => {
        const result = data.setupTradeCapacity;
        if (result.success) {
          const msg =
            result.skippedMagmaOrder && result.skippedOutboundChannel
              ? 'Capacity already sufficient'
              : result.skippedMagmaOrder || result.skippedOutboundChannel
                ? 'Trade capacity increased successfully'
                : 'Trade channels set up successfully';
          toast.success(msg);
          setAmount('');
          clearQuote();
        }
      },
      onError: err => toast.error(getErrorContent(err)),
    });

  const isAssetPurchase = txType === TapTransactionType.Purchase;
  const offerAsset = selectedOffer?.asset;
  const symbol = offerAsset?.symbol || selectedAsset?.symbol || '';
  const precision = offerAsset?.precision ?? selectedAsset?.precision ?? 0;
  const rateFull = selectedOffer?.rate.fullAmount || '0';
  const rateDisplay = selectedOffer?.rate.displayAmount || '0';
  const hasRate = rateDisplay !== '0' || rateFull !== '0';
  const isValid = amount && Number(amount) > 0;
  const quoteExpired = secondsLeft != null && secondsLeft <= 0;
  const loading = tradeLoading || setupLoading;

  const atomicAmount = isValid ? displayToAtomic(amount, precision) : BigInt(0);

  let satsAmount = '0';
  if (isValid && hasRate) {
    try {
      // Use display rate for the estimate — it's in "display asset units per BTC"
      // so we can divide display amount directly: (amount / rate) * 1e8
      satsAmount =
        rateDisplay !== '0'
          ? new Big(amount)
              .div(new Big(rateDisplay))
              .times(1e8)
              .round(0, Big.roundDown)
              .toString()
          : displayAssetToSats(amount, rateFull, precision);
    } catch {
      satsAmount = '0';
    }
  }

  // Whether we have a magma offer (for channel setup) vs a direct trading partner
  const isMagmaOffer = !!selectedOffer?.magmaOfferId;

  // Offer readiness query — only for Magma offers
  const {
    data: readinessData,
    loading: readinessLoading,
    refetch: refetchReadiness,
  } = useQuery(GET_OFFER_READINESS, {
    variables: {
      input: {
        peer_pubkey: selectedOffer?.node.pubkey || '',
        tapd_asset_id: offerAsset?.assetId || undefined,
        tapd_group_key: offerAsset?.groupKey || undefined,
      },
    },
    skip: !selectedOffer?.node.pubkey || !isMagmaOffer,
    fetchPolicy: 'cache-and-network',
  });

  const readiness = readinessData?.rails?.offer_readiness;
  const btcCh = readiness?.btc_channels;
  const assetCh = readiness?.asset_channels;
  const hasBtcChannel = (btcCh?.open_count ?? 0) > 0;
  const hasBtcPending = (btcCh?.pending_count ?? 0) > 0;
  const hasAssetChannel = (assetCh?.open_count ?? 0) > 0;
  const hasAssetPending = (assetCh?.pending_count ?? 0) > 0;
  const hasPendingOrder = readiness?.has_pending_order ?? false;
  const onchainSats = Number(readiness?.onchain_balance_sats ?? '0');
  const onchainAsset = BigInt(readiness?.onchain_asset_balance ?? '0');
  const channelsReady = hasBtcChannel && hasAssetChannel;

  // Trading capacity based on channel balances
  const localSats = Number(btcCh?.total_local_sats ?? '0');
  const remoteSats = Number(btcCh?.total_remote_sats ?? '0');
  const localAtomic = assetCh?.total_local_atomic ?? '0';
  const remoteAtomic = assetCh?.total_remote_atomic ?? '0';

  const atomicToDisplayStr = (atomic: string) =>
    precision > 0
      ? new Big(atomic).div(new Big(10).pow(precision)).toFixed(precision)
      : atomic;

  // Buy asset (PURCHASE): send BTC, receive asset
  // Limited by: outbound BTC (localSats) AND inbound asset (remoteAtomic)
  const maxSellSats = channelsReady ? localSats : 0;
  const maxSellAssetAtomic = channelsReady ? remoteAtomic : '0';
  const maxSellAsset = atomicToDisplayStr(maxSellAssetAtomic);

  // Sell asset (SALE): send asset, receive BTC
  // Limited by: outbound asset (localAtomic) AND inbound BTC (remoteSats)
  const maxBuyAsset = channelsReady ? atomicToDisplayStr(localAtomic) : '0';
  const maxBuySats = channelsReady ? remoteSats : 0;

  const hasCapacity = channelsReady
    ? isAssetPurchase
      ? maxSellSats > 0 && maxSellAssetAtomic !== '0'
      : Number(maxBuyAsset) > 0 && maxBuySats > 0
    : true;

  // For direct trading partners (no magma offer), we assume channels exist
  const canDirectTrade =
    (!isMagmaOffer && !!selectedOffer?.node.pubkey) || channelsReady;

  // Check if on-chain balances are sufficient for the setup
  const hasOnchainForSetup = isValid
    ? isAssetPurchase
      ? onchainSats >= Number(satsAmount)
      : onchainAsset >= atomicAmount && onchainSats > 0
    : true;

  const handleGetQuote = async () => {
    if (!isValid || !selectedOffer?.node.pubkey || !offerAsset) return;
    clearQuote();

    const { data, error } = await fetchQuote({
      variables: {
        input: {
          tapd_asset_id: offerAsset.assetId || '',
          tapd_group_key: offerAsset.groupKey || undefined,
          asset_amount: atomicAmount.toString(),
          transaction_type: txType,
          peer_pubkey: selectedOffer.node.pubkey,
          asset_symbol: symbol,
          asset_precision: precision,
        },
      },
    });

    if (error) {
      toast.error(getErrorContent(error));
      return;
    }

    const quote = data?.getTradeQuote;
    if (!quote?.sats_amount || quote.sats_amount === '0') {
      toast.error('Could not get a valid quote — try again');
      return;
    }

    setQuotedSats(quote.sats_amount);
    setQuotePaymentRequest(quote.payment_request || null);
    setQuoteRfqId(quote.rfq_id || null);
    if (quote.expiry_epoch) setQuoteExpiry(Number(quote.expiry_epoch));
  };

  const handleExecuteTrade = () => {
    if (!selectedOffer?.node.pubkey || !offerAsset || !isValid) return;
    const displaySats = quotedSats || satsAmount;
    if (!displaySats || displaySats === '0') return;

    executeTrade({
      variables: {
        input: {
          tapd_asset_id: offerAsset.assetId || '',
          tapd_group_key: offerAsset.groupKey || undefined,
          asset_amount: atomicAmount.toString(),
          sats_amount: displaySats,
          transaction_type: txType,
          peer_pubkey: selectedOffer.node.pubkey,
          asset_symbol: symbol,
          asset_precision: precision,
          payment_request: quotePaymentRequest || undefined,
          rfq_id: quoteRfqId || undefined,
        },
      },
    });
  };

  const handleSetupPartner = () => {
    if (!selectedOffer?.node.pubkey || !offerAsset || !isValid) return;

    setupCapacity({
      variables: {
        input: {
          magmaOfferId: selectedOffer.magmaOfferId,
          ambossAssetId: offerAsset.id,
          assetAmount: atomicAmount.toString(),
          assetRate: rateFull !== '0' ? rateFull : rateDisplay,
          transactionType: txType,
          swapNodePubkey: selectedOffer.node.pubkey,
          swapNodeSockets: selectedOffer.node.sockets,
          tapdAssetId: offerAsset.assetId || undefined,
          tapdGroupKey: offerAsset.groupKey || undefined,
          satsAmount: isAssetPurchase ? satsAmount : undefined,
          openAssetChannel: !isAssetPurchase ? !hasAssetChannel : undefined,
        },
      },
    });
  };

  const hasQuote = !!quotedSats && !quoteExpired;
  const displaySats = quotedSats || (hasRate ? satsAmount : null);
  const satsLabel = displaySats ? `${formatNumber(displaySats)} sats` : '—';

  const exceedsCapacity =
    !!isValid &&
    channelsReady &&
    Number(amount) > Number(isAssetPurchase ? maxSellAsset : maxBuyAsset);

  const content = (
    <>
      {/* Buy / Sell asset toggle */}
      <div className="flex h-9 rounded-md overflow-hidden border border-border">
        {([TapTransactionType.Purchase, TapTransactionType.Sale] as const).map(
          t => (
            <button
              key={t}
              onClick={() => dispatch({ type: 'setTxType', txType: t })}
              className={cn(
                'flex-1 text-sm font-medium transition-colors',
                txType === t
                  ? t === TapTransactionType.Purchase
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {t === TapTransactionType.Purchase
                ? `Buy ${symbol || 'Asset'}`
                : `Sell ${symbol || 'Asset'}`}
            </button>
          )
        )}
      </div>

      {/* No offer selected */}
      {!selectedOffer ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ArrowUpDown size={24} className="text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            {selectedAsset
              ? 'Select an offer to start trading'
              : 'Select an asset and offer'}
          </p>
        </div>
      ) : (
        <>
          {/* Peer info */}
          <div className="flex flex-col gap-1 rounded-md border border-border/60 bg-muted/20 px-3 py-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peer</span>
              <span className="font-mono truncate ml-2 max-w-[180px]">
                {selectedOffer.node.alias ||
                  selectedOffer.node.pubkey?.slice(0, 16)}
              </span>
            </div>
            {hasRate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate</span>
                <span>
                  {formatNumber(
                    selectedOffer.rate.displayAmount ||
                      selectedOffer.rate.fullAmount ||
                      '0'
                  )}{' '}
                  {symbol}/BTC
                </span>
              </div>
            )}
            {selectedOffer.available.displayAmount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available</span>
                <span>
                  {formatNumber(selectedOffer.available.displayAmount)} {symbol}
                </span>
              </div>
            )}
          </div>

          {/* Channel readiness (Magma offers only) */}
          {isMagmaOffer && (
            <div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-muted/20 px-3 py-2.5 text-xs">
              <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
                Channels
              </span>
              {readinessLoading && !readiness ? (
                <div className="flex justify-center py-2">
                  <Loader2
                    size={14}
                    className="animate-spin text-muted-foreground"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    {hasBtcChannel ? (
                      <CheckCircle2
                        size={12}
                        className="text-green-500 shrink-0"
                      />
                    ) : hasBtcPending || hasPendingOrder || setupLoading ? (
                      <Loader2
                        size={12}
                        className="animate-spin text-yellow-500 shrink-0"
                      />
                    ) : (
                      <Circle
                        size={12}
                        className="text-muted-foreground/40 shrink-0"
                      />
                    )}
                    <span
                      className={cn(
                        hasBtcChannel
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      BTC channel
                    </span>
                    {hasBtcChannel && btcCh && (
                      <span className="ml-auto text-muted-foreground tabular-nums">
                        {formatNumber(
                          isAssetPurchase
                            ? btcCh.total_local_sats
                            : btcCh.total_remote_sats
                        )}{' '}
                        sats
                      </span>
                    )}
                    {!hasBtcChannel &&
                      (hasBtcPending || hasPendingOrder || setupLoading) && (
                        <span className="ml-auto text-yellow-500">
                          {setupLoading
                            ? 'Setting up...'
                            : hasBtcPending
                              ? 'Opening...'
                              : 'Order in progress'}
                        </span>
                      )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasAssetChannel ? (
                      <CheckCircle2
                        size={12}
                        className="text-green-500 shrink-0"
                      />
                    ) : hasAssetPending || hasPendingOrder || setupLoading ? (
                      <Loader2
                        size={12}
                        className="animate-spin text-yellow-500 shrink-0"
                      />
                    ) : (
                      <Circle
                        size={12}
                        className="text-muted-foreground/40 shrink-0"
                      />
                    )}
                    <span
                      className={cn(
                        hasAssetChannel
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {symbol || 'Asset'} channel
                    </span>
                    {hasAssetChannel && assetCh && (
                      <span className="ml-auto text-muted-foreground tabular-nums">
                        {formatNumber(
                          atomicToDisplayStr(
                            isAssetPurchase ? remoteAtomic : localAtomic
                          )
                        )}{' '}
                        {symbol}
                      </span>
                    )}
                    {!hasAssetChannel &&
                      (hasAssetPending || hasPendingOrder || setupLoading) && (
                        <span className="ml-auto text-yellow-500">
                          {setupLoading
                            ? 'Setting up...'
                            : hasAssetPending
                              ? 'Opening...'
                              : 'Order in progress'}
                        </span>
                      )}
                  </div>
                  {!channelsReady &&
                    !hasBtcPending &&
                    !hasAssetPending &&
                    !hasPendingOrder &&
                    !setupLoading && (
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        {hasBtcChannel || hasAssetChannel
                          ? 'Will add'
                          : 'Setup will open'}{' '}
                        {!hasBtcChannel && !hasAssetChannel
                          ? isAssetPurchase
                            ? `a BTC channel and purchase a ${symbol} channel`
                            : `a ${symbol} channel and purchase a BTC channel`
                          : isAssetPurchase
                            ? !hasBtcChannel
                              ? 'a BTC channel'
                              : `a ${symbol} channel`
                            : !hasAssetChannel
                              ? `a ${symbol} channel`
                              : 'a BTC channel'}
                      </p>
                    )}
                </>
              )}
            </div>
          )}

          {/* Trading capacity */}
          {channelsReady && (
            <div className="flex flex-col gap-1 rounded-md border border-border/60 bg-muted/20 px-3 py-2.5 text-xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
                  Capacity
                </span>
                <button
                  onClick={() => refetchReadiness()}
                  disabled={readinessLoading}
                  className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                >
                  <RefreshCw
                    size={10}
                    className={readinessLoading ? 'animate-spin' : ''}
                  />
                </button>
              </div>
              {isAssetPurchase ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max send</span>
                    <span className="tabular-nums">
                      {formatNumber(maxSellSats)} sats
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max receive</span>
                    <span className="tabular-nums">
                      {formatNumber(maxSellAsset)} {symbol}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max send</span>
                    <span className="tabular-nums">
                      {formatNumber(maxBuyAsset)} {symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max receive</span>
                    <span className="tabular-nums">
                      {formatNumber(maxBuySats)} sats
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="border-t border-border/40" />

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              {isMagmaOffer && !channelsReady ? 'Trade Limit' : 'Amount'}
            </label>
            {isMagmaOffer && !channelsReady && (
              <p className="text-[10px] text-muted-foreground/60 -mt-0.5">
                Buy up to this amount, then sell to free up capacity
              </p>
            )}
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                disabled={!hasCapacity}
                placeholder={
                  !hasCapacity
                    ? 'No capacity'
                    : precision > 0
                      ? `0.${'0'.repeat(Math.min(precision, 2))}`
                      : '0'
                }
                value={amount}
                onChange={e => {
                  let v = e.target.value.replace(/[^0-9.]/g, '');
                  // Remove extra decimal points
                  const parts = v.split('.');
                  if (parts.length > 2) {
                    v = `${parts[0]}.${parts.slice(1).join('')}`;
                  }
                  // Block decimals when precision is 0
                  if (precision === 0) {
                    v = v.replace(/\./g, '');
                  }
                  // Limit decimal places to asset precision
                  if (precision > 0 && v.includes('.')) {
                    const [whole, frac] = v.split('.');
                    v = `${whole}.${frac.slice(0, precision)}`;
                  }
                  setAmount(v);
                  clearQuote();
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-16 tabular-nums"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {symbol}
              </span>
            </div>
            {isValid && hasRate && (
              <div className="text-[11px] text-muted-foreground tabular-nums">
                &asymp; {satsLabel}
              </div>
            )}
            {exceedsCapacity && (
              <p className="text-[11px] text-yellow-500">
                Exceeds max capacity of{' '}
                {formatNumber(isAssetPurchase ? maxSellAsset : maxBuyAsset)}{' '}
                {symbol}
              </p>
            )}
          </div>

          {/* Quote summary */}
          {hasQuote && (
            <>
              <div className="border-t border-border/40" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
                    Quote
                  </span>
                  {secondsLeft != null && secondsLeft > 0 && (
                    <span className="text-[10px] text-muted-foreground tabular-nums flex items-center gap-1">
                      <Clock size={10} />
                      {secondsLeft}s
                    </span>
                  )}
                </div>

                <div className="rounded-md border border-border bg-muted/20 p-2.5 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <ArrowRight size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Send</span>
                    <span className="ml-auto font-medium tabular-nums">
                      {isAssetPurchase ? satsLabel : `${amount} ${symbol}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ArrowLeft size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Receive</span>
                    <span className="ml-auto font-medium tabular-nums">
                      {isAssetPurchase ? `${amount} ${symbol}` : satsLabel}
                    </span>
                  </div>
                  {quotedSats && Number(amount) > 0 && (
                    <div className="flex items-center gap-1.5 border-t border-border/40 pt-1.5">
                      <span className="text-muted-foreground">Rate</span>
                      <span className="ml-auto font-medium tabular-nums">
                        {formatNumber(
                          new Big(Number(amount))
                            .div(new Big(Number(quotedSats)).div(1e8))
                            .toFixed(2)
                        )}{' '}
                        {symbol}/BTC
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Setup recap */}
          {isMagmaOffer && !channelsReady && isValid && satsAmount !== '0' && (
            <>
              <div className="border-t border-border/40" />
              <div className="flex flex-col gap-2">
                {(() => {
                  // PURCHASE (Buy asset): Magma buys inbound asset, user opens BTC outbound
                  // SALE (Sell asset): Magma buys inbound BTC, user opens asset outbound
                  //
                  // Magma card: check if inbound capacity is sufficient.
                  //   PURCHASE inbound = remote asset
                  //   SALE inbound = remote BTC sats
                  const magmaNeeded = isAssetPurchase
                    ? atomicAmount > BigInt(remoteAtomic)
                    : Number(satsAmount) > remoteSats;

                  if (!magmaNeeded) return null;

                  const hasFees =
                    selectedOffer?.fees &&
                    (selectedOffer.fees.baseFeeSats > 0 ||
                      selectedOffer.fees.feeRatePpm > 0);
                  const feeEstimate = hasFees
                    ? Math.ceil(
                        selectedOffer.fees.baseFeeSats +
                          (selectedOffer.fees.feeRatePpm * Number(satsAmount)) /
                            1_000_000
                      )
                    : 0;

                  let sizeLabel: string;
                  if (isAssetPurchase) {
                    const existing = BigInt(remoteAtomic);
                    const deficit = atomicAmount - existing;
                    const displayAmt =
                      existing > 0
                        ? atomicToDisplayStr(deficit.toString())
                        : amount;
                    const prefix =
                      existing > 0 ? 'Additional channel' : 'Channel';
                    sizeLabel = `${prefix} of ${formatNumber(displayAmt)} ${symbol}`;
                  } else {
                    const deficitSats = Number(satsAmount) - remoteSats;
                    const prefix =
                      remoteSats > 0 ? 'Additional BTC channel' : 'BTC channel';
                    sizeLabel = `${prefix} of ${formatNumber(String(Math.ceil(deficitSats)))} sats`;
                  }

                  return (
                    <div className="rounded-md bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
                      {sizeLabel} will be purchased via Magma
                      {hasFees ? (
                        <>
                          {' '}
                          for &asymp;{' '}
                          <span className="text-foreground font-medium tabular-nums">
                            {formatNumber(feeEstimate)} sats
                          </span>
                        </>
                      ) : null}
                    </div>
                  );
                })()}
                {(() => {
                  // Outbound card: user opens the channel themselves.
                  //   PURCHASE: BTC outbound (check localSats)
                  //   SALE: asset outbound (check localAtomic)
                  if (isAssetPurchase) {
                    if (hasBtcChannel && localSats >= Number(satsAmount))
                      return null;
                    const needed = Number(satsAmount);
                    const insufficient = onchainSats < needed;
                    return (
                      <div className="rounded-md bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
                        BTC channel of{' '}
                        <span className="text-foreground font-medium tabular-nums">
                          {formatNumber(satsAmount)} sats
                        </span>{' '}
                        will be opened to this trade partner
                        {insufficient && (
                          <p className="text-destructive mt-1">
                            Insufficient on-chain balance (
                            {formatNumber(String(onchainSats))} sats available)
                          </p>
                        )}
                      </div>
                    );
                  }

                  // SALE: asset outbound — needs on-chain assets + sats
                  if (hasAssetChannel && BigInt(localAtomic) >= atomicAmount)
                    return null;
                  const insufficient =
                    onchainAsset < atomicAmount || onchainSats === 0;
                  return (
                    <div className="rounded-md bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
                      {symbol} channel of{' '}
                      <span className="text-foreground font-medium tabular-nums">
                        {formatNumber(amount)} {symbol}
                      </span>{' '}
                      will be opened to this trade partner
                      {insufficient && (
                        <p className="text-destructive mt-1">
                          Insufficient on-chain balance (
                          {formatNumber(
                            atomicToDisplayStr(onchainAsset.toString())
                          )}{' '}
                          {symbol}, {formatNumber(String(onchainSats))} sats
                          available)
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="pt-1">
            {canDirectTrade || hasQuote ? (
              hasQuote ? (
                <Button
                  className="w-full"
                  size="sm"
                  onClick={handleExecuteTrade}
                  disabled={
                    loading || quoteExpired || !isValid || exceedsCapacity
                  }
                >
                  {tradeLoading ? (
                    <>
                      <Loader2 size={14} className="mr-1.5 animate-spin" />
                      Trading...
                    </>
                  ) : quoteExpired ? (
                    'Quote expired'
                  ) : (
                    'Execute Trade'
                  )}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="sm"
                  onClick={handleGetQuote}
                  disabled={
                    quoteLoading || !isValid || !hasCapacity || exceedsCapacity
                  }
                >
                  {quoteLoading ? (
                    <>
                      <Loader2 size={14} className="mr-1.5 animate-spin" />
                      Getting quote...
                    </>
                  ) : (
                    'Get Quote'
                  )}
                </Button>
              )
            ) : isMagmaOffer ? (
              <>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={handleSetupPartner}
                  disabled={loading || !isValid || !hasOnchainForSetup}
                >
                  {setupLoading ? (
                    <>
                      <Loader2 size={14} className="mr-1.5 animate-spin" />
                      {channelsReady || hasBtcChannel || hasAssetChannel
                        ? 'Increasing capacity...'
                        : 'Setting up...'}
                    </>
                  ) : channelsReady || hasBtcChannel || hasAssetChannel ? (
                    'Increase Trade Capacity'
                  ) : (
                    'Setup Trade Channels'
                  )}
                </Button>
                <p className="text-[10px] text-muted-foreground/50 text-center mt-1.5">
                  {channelsReady || hasBtcChannel || hasAssetChannel
                    ? 'This will add capacity. You can trade once channels confirm.'
                    : 'This only opens channels. You can trade once setup is complete.'}
                </p>
              </>
            ) : (
              <Button className="w-full" size="sm" disabled>
                Select an offer
              </Button>
            )}

            {quoteExpired && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={handleGetQuote}
                disabled={quoteLoading}
              >
                Get new quote
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );

  if (embedded) {
    return <div className="space-y-3">{content}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-border/60">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Order Form
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">{content}</div>
      <div className="px-3 py-2 border-t border-border/60 text-center">
        <span className="text-[10px] text-muted-foreground/40">
          Trading powered by Amboss
        </span>
      </div>
    </div>
  );
};
