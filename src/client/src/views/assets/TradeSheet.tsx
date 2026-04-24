import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
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
import { useGetPendingChannelsQuery } from '../../graphql/queries/__generated__/getPendingChannels.generated';
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
  ambossAssetId: string;
  tapdAssetId: string;
  tapdGroupKey: string;
  assetSymbol: string;
  assetPrecision: number;
  transactionType: TapTransactionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PendingChannelCard: FC<{
  txId: string;
  capacity: string;
  local: string;
  remote: string;
}> = ({ txId, capacity, local, remote }) => (
  <div className="flex flex-col gap-0.5 rounded-md border border-blue-500/30 bg-blue-500/5 px-2 py-1.5">
    <div className="flex justify-between">
      <span className="text-muted-foreground">{capacity}</span>
      <span>
        {local} / {remote}
      </span>
    </div>
    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
      <span className="font-mono truncate mr-2">{txId}</span>
      <span className="text-blue-500 flex items-center gap-1 shrink-0">
        <Clock className="h-3 w-3" />
        opening
      </span>
    </div>
  </div>
);

const OpenChannelCard: FC<{
  channelId: string;
  capacity: string;
  local: string;
  remote: string;
  isActive: boolean;
}> = ({ channelId, capacity, local, remote, isActive }) => (
  <div className="flex flex-col gap-0.5 rounded-md border border-border bg-muted/20 px-2 py-1.5">
    <div className="flex justify-between">
      <span className="text-muted-foreground">{capacity}</span>
      <span>
        {local} / {remote}
      </span>
    </div>
    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
      <span className="font-mono">{channelId}</span>
      <span className={isActive ? 'text-green-500' : 'text-yellow-500'}>
        {isActive ? 'active' : 'inactive'}
      </span>
    </div>
  </div>
);

export const TradeSheet: FC<TradeSheetProps> = ({
  offer,
  ambossAssetId,
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

  const clearQuoteState = () => {
    setQuotedSats(null);
    setQuotePaymentRequest(null);
    setQuoteRfqId(null);
    setQuoteExpiry(null);
  };

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
          clearQuoteState();
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
        clearQuoteState();
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
      fetchPolicy: 'network-only',
    });

  const { data: pendingData, loading: pendingLoading } =
    useGetPendingChannelsQuery({
      skip: !offer?.node.pubkey || !open,
      fetchPolicy: 'network-only',
    });

  const matchAsset = (asset: {
    group_key?: string | null;
    asset_id: string;
  }): boolean =>
    tapdGroupKey
      ? asset.group_key === tapdGroupKey
      : tapdAssetId
        ? asset.asset_id === tapdAssetId
        : false;

  if (!offer) return null;

  const pendingPeerChannels = (pendingData?.getPendingChannels || []).filter(
    ch => ch.is_opening && ch.partner_public_key === offer.node.pubkey
  );

  const pendingBtcChannels = pendingPeerChannels.filter(ch => !ch.asset);
  const pendingAssetChannels = pendingPeerChannels.filter(
    ch => ch.asset && matchAsset(ch.asset)
  );

  const isAssetPurchase = transactionType === TapTransactionType.Purchase;
  const nodeLabel = offer.node.alias || offer.node.pubkey?.slice(0, 16);
  const rateDisplay = offer.rate.displayAmount || offer.rate.fullAmount;
  const availableDisplay =
    offer.available.displayAmount || offer.available.fullAmount;
  const rate = offer.rate.fullAmount || '0';

  const peerChannels = channelsData?.getChannels || [];

  const btcOnlyChannels = peerChannels.filter(ch => !ch.asset);
  const allPeerAssetChannels = peerChannels.filter(ch => ch.asset);

  const assetChannels = allPeerAssetChannels.filter(
    ch => ch.asset && matchAsset(ch.asset)
  );

  const totalBtcLocal = btcOnlyChannels.reduce(
    (sum, ch) => sum + ch.local_balance,
    0
  );
  const totalAssetLocal = assetChannels.reduce(
    (sum, ch) => sum + BigInt(ch.asset?.local_balance || '0'),
    0n
  );
  const totalAssetRemote = assetChannels.reduce(
    (sum, ch) => sum + BigInt(ch.asset?.remote_balance || '0'),
    0n
  );
  const totalBtcRemote = btcOnlyChannels.reduce(
    (sum, ch) => sum + ch.remote_balance,
    0
  );

  const isValid = amount && Number(amount) > 0;

  const hasPendingOutbound = isAssetPurchase
    ? pendingBtcChannels.length > 0
    : pendingAssetChannels.length > 0;

  const hasPendingInbound = isAssetPurchase
    ? pendingAssetChannels.length > 0
    : pendingBtcChannels.length > 0;

  const pendingOutboundSats = pendingBtcChannels.reduce(
    (sum, ch) => sum + (ch.local_balance || 0),
    0
  );

  // Determine input mode from raw capacity to avoid circular dependency.
  // When buying with existing or pending asset inbound but no BTC outbound,
  // the user opens a direct BTC channel (amount = sats) instead of a Magma order.
  const needsOnlyOutboundBtc =
    isAssetPurchase &&
    (totalAssetRemote > 0n || hasPendingInbound) &&
    !(totalBtcLocal > 0) &&
    !hasPendingOutbound;

  // Input is asset display units unless needsOnlyOutboundBtc (sats directly).
  // rate is in atomic-asset-units per BTC (full_amount from trade API)
  const satsAmount =
    isValid && !needsOnlyOutboundBtc
      ? displayAssetToSats(amount, rate, assetPrecision)
      : '0';

  const atomicTradeAmount =
    isValid && !needsOnlyOutboundBtc
      ? displayToAtomic(amount, assetPrecision)
      : 0n;

  const availableAtomic = offer.available.fullAmount
    ? BigInt(offer.available.fullAmount)
    : null;

  const exceedsAvailable =
    isValid &&
    !needsOnlyOutboundBtc &&
    availableAtomic !== null &&
    atomicTradeAmount > availableAtomic;

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
        : totalAssetLocal > 0n;

  const hasInbound = needsOnlyOutboundBtc
    ? true
    : isValid
      ? isAssetPurchase
        ? totalAssetRemote >= atomicTradeAmount
        : totalBtcRemote >= Number(satsAmount)
      : isAssetPurchase
        ? totalAssetRemote > 0n
        : totalBtcRemote > 0;

  // Count offline channels with balance to warn (not block) the user.
  const outboundChannels = isAssetPurchase ? btcOnlyChannels : assetChannels;
  const inboundChannels = isAssetPurchase ? assetChannels : btcOnlyChannels;

  const outboundTotal = outboundChannels.length;
  const outboundOfflineCount = outboundChannels.filter(
    ch => !ch.is_active
  ).length;

  const inboundTotal = inboundChannels.length;
  const inboundOfflineCount = inboundChannels.filter(
    ch => !ch.is_active
  ).length;

  const readyToTrade = hasOutbound && hasInbound;
  const loading = openChannelLoading || setupLoading || tradeLoading;
  const hasRate = !!rate && rate !== '0';

  // Safeguard: the quoted sats amount can exceed our BTC liquidity with the
  // peer (e.g. rate changed since the balance checks above). For buys the
  // trader pays out via their local BTC balance; for sells the sats leg comes
  // back via the peer's local balance (our remote).
  const quotedSatsNum = quotedSats ? Number(quotedSats) : 0;
  const btcBalanceForTrade = isAssetPurchase ? totalBtcLocal : totalBtcRemote;
  const quotedSatsInsufficient =
    quotedSatsNum > 0 && btcBalanceForTrade < quotedSatsNum;

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

  // Amount-independent: do both channel types exist (open or pending)?
  const outboundExists = isAssetPurchase
    ? totalBtcLocal > 0 || hasPendingOutbound
    : totalAssetLocal > 0n || hasPendingOutbound;
  const inboundExists = isAssetPurchase
    ? totalAssetRemote > 0n || hasPendingInbound
    : totalBtcRemote > 0 || hasPendingInbound;
  const allChannelsExist = outboundExists && inboundExists;

  // Only suppress the input when channels are still pending. If all channels
  // are open but balance is insufficient, the user can still adjust the amount.
  const hasPendingChannels = pendingPeerChannels.length > 0;
  const waitingForChannels =
    allChannelsExist && !readyToTrade && hasPendingChannels;

  // Whether to hide the outbound card on the confirm step (already covered).
  const skipOutboundCard =
    hasOutbound ||
    (hasPendingOutbound &&
      (!isValid || pendingOutboundSats >= Number(satsAmount)));

  // For sells, channel setup (setupTradePartner) is not yet implemented on the
  // server. Show what's insufficient and block the setup flow.
  const sellNeedsChannels = !isAssetPurchase && isValid && !readyToTrade;

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

    // Skip opening a BTC channel when outbound is already sufficient (open)
    // or a pending channel covers the needed capacity.
    const skipOutboundBtc =
      isAssetPurchase &&
      (hasOutbound ||
        (hasPendingOutbound && pendingOutboundSats >= Number(satsAmount)));

    setupPartner({
      variables: {
        input: {
          magmaOfferId: offer.magmaOfferId,
          ambossAssetId,
          assetAmount: atomicTradeAmount.toString(),
          assetRate: rate,
          transactionType,
          swapNodePubkey: offer.node.pubkey,
          swapNodeSockets: offer.node.sockets,
          tapdAssetId: tapdAssetId || undefined,
          tapdGroupKey: tapdGroupKey || undefined,
          satsAmount: skipOutboundBtc ? undefined : satsAmount,
        },
      },
    });
  };

  const handleReviewTrade = async () => {
    if (!amount || !offer.node.pubkey) return;
    clearQuoteState();
    const assetAtomicAmount = atomicTradeAmount.toString();
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
    if (quotedSatsInsufficient) {
      toast.error(
        `Quoted ${quotedSatsNum.toLocaleString()} sats exceeds available BTC liquidity with peer`
      );
      return;
    }
    executeTrade({
      variables: {
        input: {
          tapdAssetId,
          tapdGroupKey: tapdGroupKey || undefined,
          assetAmount: atomicTradeAmount.toString(),
          satsAmount: displaySats,
          transactionType,
          peerPubkey: offer.node.pubkey,
          paymentRequest: quotePaymentRequest || undefined,
          rfqId: quoteRfqId || undefined,
        },
      },
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStep('input');
      setAmount('');
      clearQuoteState();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-90 sm:max-w-100">
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
                    {rateDisplay} BTC/{assetSymbol}
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
              {channelsLoading || pendingLoading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Checking channels...
                </div>
              ) : btcOnlyChannels.length === 0 &&
                assetChannels.length === 0 &&
                pendingBtcChannels.length === 0 &&
                pendingAssetChannels.length === 0 ? (
                <div className="text-xs text-muted-foreground">
                  No channels with this node
                </div>
              ) : (
                <div className="flex flex-col gap-1 text-xs">
                  {pendingBtcChannels.map(ch => (
                    <PendingChannelCard
                      key={ch.transaction_id}
                      txId={ch.transaction_id}
                      capacity={`${((ch.local_balance || 0) + (ch.remote_balance || 0)).toLocaleString()} sats`}
                      local={(ch.local_balance || 0).toLocaleString()}
                      remote={(ch.remote_balance || 0).toLocaleString()}
                    />
                  ))}
                  {pendingAssetChannels.map(ch => (
                    <PendingChannelCard
                      key={ch.transaction_id}
                      txId={ch.transaction_id}
                      capacity={`${atomicToDisplay(ch.asset!.capacity, assetPrecision)} ${assetSymbol}`}
                      local={atomicToDisplay(
                        ch.asset!.local_balance,
                        assetPrecision
                      )}
                      remote={atomicToDisplay(
                        ch.asset!.remote_balance,
                        assetPrecision
                      )}
                    />
                  ))}
                  {btcOnlyChannels.map(ch => (
                    <OpenChannelCard
                      key={ch.id}
                      channelId={ch.id}
                      capacity={`${Number(ch.capacity).toLocaleString()} sats`}
                      local={Number(ch.local_balance).toLocaleString()}
                      remote={Number(ch.remote_balance).toLocaleString()}
                      isActive={ch.is_active}
                    />
                  ))}
                  {assetChannels.map(ch => (
                    <OpenChannelCard
                      key={ch.id}
                      channelId={ch.id}
                      capacity={`${atomicToDisplay(ch.asset!.capacity, assetPrecision)} ${assetSymbol}`}
                      local={atomicToDisplay(
                        ch.asset!.local_balance,
                        assetPrecision
                      )}
                      remote={atomicToDisplay(
                        ch.asset!.remote_balance,
                        assetPrecision
                      )}
                      isActive={ch.is_active}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Channel status */}
            {!channelsLoading && !pendingLoading && (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Channel status</span>
                <div className="flex flex-col gap-1 text-xs">
                  {pendingPeerChannels.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-blue-500">
                        {pendingPeerChannels.length} channel
                        {pendingPeerChannels.length > 1 ? 's' : ''} opening with
                        this node
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {outboundExists && !hasPendingOutbound ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : hasPendingOutbound ? (
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
                    )}
                    <span>
                      Outbound ({isAssetPurchase ? 'BTC' : assetSymbol})
                      {outboundExists && !hasPendingOutbound ? (
                        <span className="text-muted-foreground ml-1">
                          {isAssetPurchase
                            ? `${totalBtcLocal.toLocaleString()} sats`
                            : `${atomicToDisplay(totalAssetLocal.toString(), assetPrecision)} ${assetSymbol}`}
                        </span>
                      ) : hasPendingOutbound ? (
                        <span className="text-blue-500 ml-1">opening</span>
                      ) : (
                        <span className="text-yellow-500 ml-1">missing</span>
                      )}
                    </span>
                  </div>
                  {outboundOfflineCount > 0 && hasOutbound && (
                    <div className="flex items-center gap-2 ml-5.5 text-yellow-500">
                      <AlertCircle className="h-3 w-3" />
                      <span>
                        {outboundOfflineCount === outboundTotal
                          ? outboundTotal === 1
                            ? 'Channel offline'
                            : `All ${outboundTotal} channels offline`
                          : `${outboundOfflineCount} of ${outboundTotal} channels offline`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {inboundExists && !hasPendingInbound ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : hasPendingInbound ? (
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
                    )}
                    <span>
                      Inbound ({isAssetPurchase ? assetSymbol : 'BTC'})
                      {inboundExists && !hasPendingInbound ? (
                        <span className="text-muted-foreground ml-1">
                          {isAssetPurchase
                            ? `${atomicToDisplay(totalAssetRemote.toString(), assetPrecision)} ${assetSymbol}`
                            : `${totalBtcRemote.toLocaleString()} sats`}
                        </span>
                      ) : hasPendingInbound ? (
                        <span className="text-blue-500 ml-1">opening</span>
                      ) : (
                        <span className="text-yellow-500 ml-1">
                          missing — will be purchased via Magma
                        </span>
                      )}
                    </span>
                  </div>
                  {inboundOfflineCount > 0 && hasInbound && (
                    <div className="flex items-center gap-2 ml-5.5 text-yellow-500">
                      <AlertCircle className="h-3 w-3" />
                      <span>
                        {inboundOfflineCount === inboundTotal
                          ? inboundTotal === 1
                            ? 'Channel offline'
                            : `All ${inboundTotal} channels offline`
                          : `${inboundOfflineCount} of ${inboundTotal} channels offline`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {waitingForChannels ? (
              <div className="rounded-md border border-blue-500/30 bg-blue-500/5 p-3 text-sm text-blue-500">
                All channels are in place. Trade will be available once pending
                channels confirm.
              </div>
            ) : (
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
                {exceedsAvailable && availableDisplay && (
                  <p className="text-xs text-destructive mt-1">
                    Amount exceeds available liquidity (
                    {Number(availableDisplay).toLocaleString()} {assetSymbol})
                  </p>
                )}
              </div>
            )}

            {sellNeedsChannels && (
              <div className="rounded-md border border-yellow-500/20 bg-yellow-500/5 p-3 flex flex-col gap-1 text-sm text-yellow-600">
                {!hasOutbound && (
                  <p>
                    Insufficient outbound — you have{' '}
                    {atomicToDisplay(
                      totalAssetLocal.toString(),
                      assetPrecision
                    )}{' '}
                    {assetSymbol} available to sell.
                  </p>
                )}
                {!hasInbound && (
                  <p>
                    Insufficient inbound BTC liquidity (
                    {totalBtcRemote.toLocaleString()} sats available).
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Channel setup for sells is not yet supported — reduce the
                  amount or open channels manually.
                </p>
              </div>
            )}
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
                    {rateDisplay} BTC/{assetSymbol}
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
                    {quotedSatsInsufficient && (
                      <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600">
                        Quoted {quotedSatsNum.toLocaleString()} sats exceeds
                        available {isAssetPurchase ? 'outbound' : 'inbound'} BTC
                        liquidity with this peer (
                        {btcBalanceForTrade.toLocaleString()} sats). Rebalance
                        or reduce trade size.
                      </div>
                    )}
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
                  {!skipOutboundCard && (
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
                  {!hasInbound && !hasPendingInbound && (
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

        <SheetFooter className="flex-row gap-2 p-4">
          {step === 'input' && !waitingForChannels && (
            <Button
              onClick={
                readyToTrade ? handleReviewTrade : () => setStep('confirm')
              }
              disabled={
                quoteLoading ||
                !isValid ||
                exceedsAvailable ||
                sellNeedsChannels ||
                (!readyToTrade && !needsOnlyOutboundBtc && !offer.magmaOfferId)
              }
              className="w-full"
            >
              {readyToTrade && quoteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting quote...
                </>
              ) : readyToTrade ? (
                'Review Trade'
              ) : needsOnlyOutboundBtc ? (
                'Review Channel'
              ) : !offer.magmaOfferId ? (
                'No offer available for setup'
              ) : (
                'Review Setup'
              )}
            </Button>
          )}
          {step === 'confirm' && (
            <>
              <Button
                variant="outline"
                size="lg"
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
                  size="lg"
                  onClick={handleTrade}
                  disabled={
                    loading ||
                    quoteLoading ||
                    !displaySats ||
                    quoteExpired ||
                    quotedSatsInsufficient ||
                    exceedsAvailable
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
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading || waitingForChannels}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {needsOnlyOutboundBtc ? 'Opening...' : 'Setting up...'}
                    </>
                  ) : waitingForChannels ? (
                    'Channels opening...'
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
