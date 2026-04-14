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
import { useOpenChannelMutation } from '../../graphql/mutations/__generated__/openChannel.generated';
import { useGetPeerChannelsQuery } from '../../graphql/queries/__generated__/getPeerChannels.generated';
import { useGetTapAssetChannelBalancesQuery } from '../../graphql/queries/__generated__/getTapAssetChannelBalances.generated';
import { getErrorContent } from '../../utils/error';
import { atomicToDisplay, displayAssetToSats } from './trade.helpers';

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
        }
      },
      onError: err => toast.error(getErrorContent(err)),
    });

  const loading = openChannelLoading || setupLoading;

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
  const assetChannels = tapdGroupKey
    ? allAssetChannels.filter(ac => ac.groupKey === tapdGroupKey)
    : tapdAssetId
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
      ? BigInt(amount) * BigInt(10 ** assetPrecision)
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

    // When outbound already exists we skip opening a BTC channel by omitting satsAmount.
    const skipOutboundBtc =
      isAssetPurchase && hasInbound === false && hasOutbound === true;

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
            {isAssetPurchase ? 'Buy' : 'Sell'} {assetSymbol}
          </SheetTitle>
          <SheetDescription>
            {hasOutbound && hasInbound
              ? `Ready to trade with ${nodeLabel}`
              : step === 'input'
                ? needsOnlyOutboundBtc
                  ? `Open outbound BTC channel to ${nodeLabel}`
                  : `Set up trading channels with ${nodeLabel}`
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

            {!hasOutbound || !hasInbound ? (
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
                    inputMode="numeric"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={e =>
                      setAmount(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {needsOnlyOutboundBtc ? 'sats' : assetSymbol}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-green-500/20 bg-green-500/5 p-3 flex items-center gap-2 text-sm text-green-500">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Ready for trading
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
                    {rateDisplay} {assetSymbol}/BTC
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Channels to open</span>
              <div className="flex flex-col gap-2">
                {needsOnlyOutboundBtc ? (
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
                ) : (
                  <>
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
                    {hasOutbound && hasInbound && (
                      <div className="rounded-md border border-green-500/20 bg-green-500/5 p-3 text-sm">
                        Both channels already exist — ready to trade
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <SheetFooter className="flex gap-2">
          {(step === 'input' && !hasOutbound) ||
          (step === 'input' && !hasInbound) ? (
            <Button
              onClick={() => setStep('confirm')}
              disabled={!isValid}
              className="w-full"
            >
              {needsOnlyOutboundBtc ? 'Review Channel' : 'Review Setup'}
            </Button>
          ) : null}
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
                    {needsOnlyOutboundBtc ? 'Opening...' : 'Setting up...'}
                  </>
                ) : needsOnlyOutboundBtc ? (
                  'Open Channel'
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
