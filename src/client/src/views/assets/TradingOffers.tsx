import { FC, Fragment, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Loader2,
  Info,
  ArrowUpDown,
  Zap,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useGetTapOffersQuery } from '../../graphql/queries/__generated__/getTapOffers.generated';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetChannelsWithPeersQuery } from '../../graphql/queries/__generated__/getChannels.generated';
import { useGetTapAssetChannelBalancesQuery } from '../../graphql/queries/__generated__/getTapAssetChannelBalances.generated';
import { useGetPendingChannelsQuery } from '../../graphql/queries/__generated__/getPendingChannels.generated';
import { getErrorContent } from '../../utils/error';
import { cn } from '../../lib/utils';
import {
  TapBalanceGroupBy,
  TapTransactionType,
  TapOfferSortBy,
  TapOfferSortDir,
} from '../../graphql/types';
import { TradeSheet, Offer } from './TradeSheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ChannelStatus = {
  btc: 'none' | 'pending' | 'open';
  asset: 'none' | 'pending' | 'open';
};

const SortIcon: FC<{
  field: TapOfferSortBy;
  activeSortBy: TapOfferSortBy;
}> = ({ field, activeSortBy }) => (
  <ArrowUpDown
    size={12}
    className={cn(
      'inline ml-1',
      activeSortBy === field ? 'text-foreground' : 'text-muted-foreground/40'
    )}
  />
);

export const TradingOffers: FC = () => {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [txType, setTxType] = useState<TapTransactionType>(
    TapTransactionType.Purchase
  );
  const [sortBy, setSortBy] = useState<TapOfferSortBy>(TapOfferSortBy.Rate);
  const [sortDir, setSortDir] = useState<TapOfferSortDir>(TapOfferSortDir.Asc);
  const [minAmountInput, setMinAmountInput] = useState('');
  const [minAmount, setMinAmount] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setMinAmount(minAmountInput), 300);
    return () => clearTimeout(timer);
  }, [minAmountInput]);

  const { data: supportedData, loading: assetsLoading } =
    useGetTapSupportedAssetsQuery({
      onError: err => toast.error(getErrorContent(err)),
    });

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { group_by: TapBalanceGroupBy.GroupKey },
  });

  const { data: allChannelsData } = useGetChannelsWithPeersQuery({
    variables: { active: true },
  });
  const { data: allAssetChannelsData } = useGetTapAssetChannelBalancesQuery();
  const { data: pendingData } = useGetPendingChannelsQuery();

  const allSupported =
    supportedData?.rails?.get_tap_supported_assets?.list || [];
  const balances = balancesData?.taproot_assets?.get_balances?.balances || [];
  const ownedGroupKeys = new Set(
    balances.filter(b => b.group_key).map(b => b.group_key!)
  );
  const ownedAssetIds = new Set(
    balances.filter(b => !b.group_key && b.asset_id).map(b => b.asset_id!)
  );

  // Build asset channel indexes for trading partner detection
  const { assetChannelsByAssetId, assetChannelsByGroupKey } = useMemo(() => {
    const byAssetId = new Map<string, Set<string>>();
    const byGroupKey = new Map<string, Set<string>>();
    for (const ac of allAssetChannelsData?.taproot_assets
      ?.get_asset_channel_balances || []) {
      if (!byAssetId.has(ac.asset_id)) byAssetId.set(ac.asset_id, new Set());
      byAssetId.get(ac.asset_id)?.add(ac.partner_public_key);
      if (ac.group_key) {
        if (!byGroupKey.has(ac.group_key))
          byGroupKey.set(ac.group_key, new Set());
        byGroupKey.get(ac.group_key)?.add(ac.partner_public_key);
      }
    }
    return {
      assetChannelsByAssetId: byAssetId,
      assetChannelsByGroupKey: byGroupKey,
    };
  }, [allAssetChannelsData]);

  const btcChannelPubkeys = useMemo(() => {
    const assetChannelCountByPubkey = new Map<string, number>();
    for (const ac of allAssetChannelsData?.taproot_assets
      ?.get_asset_channel_balances || []) {
      assetChannelCountByPubkey.set(
        ac.partner_public_key,
        (assetChannelCountByPubkey.get(ac.partner_public_key) || 0) + 1
      );
    }
    const totalChannelCountByPubkey = new Map<string, number>();
    for (const ch of allChannelsData?.getChannels || []) {
      totalChannelCountByPubkey.set(
        ch.partner_public_key,
        (totalChannelCountByPubkey.get(ch.partner_public_key) || 0) + 1
      );
    }
    const pubkeys = new Set<string>();
    for (const [pubkey, total] of totalChannelCountByPubkey) {
      const assetCount = assetChannelCountByPubkey.get(pubkey) || 0;
      if (total > assetCount) pubkeys.add(pubkey);
    }
    return pubkeys;
  }, [allChannelsData, allAssetChannelsData]);

  const aliasMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ch of allChannelsData?.getChannels || []) {
      const alias = ch.partner_node_info?.node?.alias;
      if (alias && ch.partner_public_key) {
        map.set(ch.partner_public_key, alias);
      }
    }
    return map;
  }, [allChannelsData]);

  const assetChannelAssetIds = useMemo(
    () => new Set(assetChannelsByAssetId.keys()),
    [assetChannelsByAssetId]
  );

  const assetChannelGroupKeys = useMemo(
    () => new Set(assetChannelsByGroupKey.keys()),
    [assetChannelsByGroupKey]
  );

  // For SALE, show assets the node owns (match by group key or asset ID) OR has asset channels for
  const supportedAssets =
    txType === TapTransactionType.Sale
      ? allSupported.filter(
          a =>
            (a.groupKey && ownedGroupKeys.has(a.groupKey)) ||
            (!a.groupKey && a.assetId && ownedAssetIds.has(a.assetId)) ||
            (a.assetId && assetChannelAssetIds.has(a.assetId)) ||
            (a.groupKey && assetChannelGroupKeys.has(a.groupKey))
        )
      : allSupported;

  const selectedAssetData = supportedAssets.find(a => a.id === selectedAsset);
  const selectedSymbol = selectedAssetData?.symbol || '';
  const selectedPrecision = selectedAssetData?.precision ?? 0;
  const selectedTapdAssetId = selectedAssetData?.assetId || '';
  const selectedTapdGroupKey = selectedAssetData?.groupKey || '';

  const assetPeersForSelectedAsset = useMemo(
    () =>
      selectedTapdGroupKey
        ? assetChannelsByGroupKey.get(selectedTapdGroupKey)
        : selectedTapdAssetId
          ? assetChannelsByAssetId.get(selectedTapdAssetId)
          : undefined,
    [
      selectedTapdGroupKey,
      selectedTapdAssetId,
      assetChannelsByGroupKey,
      assetChannelsByAssetId,
    ]
  );

  // Per-pubkey channel status for the selected asset
  const channelStatusByPubkey = useMemo(() => {
    const map = new Map<string, ChannelStatus>();

    const ensure = (pk: string) => {
      if (!map.has(pk)) map.set(pk, { btc: 'none', asset: 'none' });
      return map.get(pk)!;
    };

    for (const pk of btcChannelPubkeys) {
      ensure(pk).btc = 'open';
    }

    for (const pk of assetPeersForSelectedAsset || []) {
      ensure(pk).asset = 'open';
    }

    for (const ch of pendingData?.getPendingChannels || []) {
      if (!ch.is_opening) continue;
      const s = ensure(ch.partner_public_key);
      if (ch.asset) {
        const match = selectedTapdGroupKey
          ? ch.asset.group_key === selectedTapdGroupKey
          : selectedTapdAssetId
            ? ch.asset.asset_id === selectedTapdAssetId
            : false;
        if (match && s.asset === 'none') {
          s.asset = 'pending';
        }
      } else if (s.btc === 'none') {
        s.btc = 'pending';
      }
    }

    return map;
  }, [
    btcChannelPubkeys,
    assetPeersForSelectedAsset,
    selectedTapdAssetId,
    selectedTapdGroupKey,
    pendingData,
  ]);

  // Find trading partners: peers with both BTC + asset channels for selected asset
  const tradingPartners = useMemo(() => {
    if (!assetPeersForSelectedAsset) return [];
    return Array.from(assetPeersForSelectedAsset)
      .filter(pubkey => btcChannelPubkeys.has(pubkey))
      .map(pubkey => ({
        pubkey,
        alias: aliasMap.get(pubkey) || null,
      }));
  }, [assetPeersForSelectedAsset, btcChannelPubkeys, aliasMap]);

  const {
    data: offersData,
    loading,
    error,
  } = useGetTapOffersQuery({
    variables: {
      input: {
        ambossAssetId: selectedAsset,
        transactionType: txType,
        sortBy,
        sortDir,
        ...(minAmount ? { minAmount } : {}),
      },
    },
    skip: !selectedAsset,
    onError: err => toast.error(getErrorContent(err)),
  });

  const offers = offersData?.magma?.get_tap_offers?.list || [];
  const totalCount = offersData?.magma?.get_tap_offers?.totalCount || 0;

  const toggleSort = (field: TapOfferSortBy) => {
    if (sortBy === field) {
      setSortDir(d =>
        d === TapOfferSortDir.Asc ? TapOfferSortDir.Desc : TapOfferSortDir.Asc
      );
    } else {
      setSortBy(field);
      setSortDir(TapOfferSortDir.Asc);
    }
  };

  const selectPartner = (pubkey: string, alias: string | null) => {
    setSelectedOffer({
      id: `partner-${pubkey}`,
      magmaOfferId: '',
      node: { alias, pubkey, sockets: [] },
      rate: { displayAmount: null, fullAmount: null },
      available: { displayAmount: null, fullAmount: null },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Step guide */}
      {!selectedOffer && (
        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          {(
            [
              {
                label: 'Select asset',
                done: !!selectedAsset,
                active: !selectedAsset,
              },
              {
                label: 'Select offer',
                done: false,
                active: !!selectedAsset,
              },
              { label: 'Trade', done: false, active: false },
            ] as const
          ).map((s, i) => (
            <Fragment key={s.label}>
              {i > 0 && (
                <ChevronRight
                  size={10}
                  className="text-muted-foreground/30 shrink-0"
                />
              )}
              <span
                className={cn(
                  'flex items-center gap-1',
                  s.done
                    ? 'text-muted-foreground/50'
                    : s.active
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground/30'
                )}
              >
                {s.done ? (
                  <CheckCircle2 size={11} className="text-green-500 shrink-0" />
                ) : (
                  <Circle size={11} className="shrink-0" />
                )}
                {s.label}
              </span>
            </Fragment>
          ))}
        </div>
      )}

      {/* Buy / Sell toggle + Asset selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex h-9 rounded-md overflow-hidden border border-border">
          {(
            [TapTransactionType.Purchase, TapTransactionType.Sale] as const
          ).map(t => (
            <button
              key={t}
              onClick={() => {
                setTxType(t);
                if (t === TapTransactionType.Sale && selectedAsset) {
                  const selected = allSupported.find(
                    a => a.id === selectedAsset
                  );
                  const isOwned =
                    (selected?.groupKey &&
                      ownedGroupKeys.has(selected.groupKey)) ||
                    (!selected?.groupKey &&
                      selected?.assetId &&
                      ownedAssetIds.has(selected.assetId));
                  const hasAssetChannels =
                    (selected?.assetId &&
                      assetChannelAssetIds.has(selected.assetId)) ||
                    (selected?.groupKey &&
                      assetChannelGroupKeys.has(selected.groupKey));
                  if (!isOwned && !hasAssetChannels) setSelectedAsset('');
                }
              }}
              className={cn(
                'px-4 py-1.5 text-sm font-medium transition-colors',
                txType === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {t === TapTransactionType.Purchase ? 'Buy' : 'Sell'}
            </button>
          ))}
        </div>

        {assetsLoading ? (
          <Loader2 className="animate-spin text-muted-foreground" size={16} />
        ) : supportedAssets.length === 0 &&
          txType === TapTransactionType.Sale ? (
          <span className="text-sm text-muted-foreground">
            No supported assets to sell
          </span>
        ) : (
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="w-40 rounded-md !h-9 px-4 text-sm font-medium">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent>
              {supportedAssets.map(a => (
                <SelectItem key={a.id} value={a.id}>
                  {a.symbol || a.id.slice(0, 8)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Trading partners */}
      {selectedAsset && tradingPartners.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium flex items-center gap-1.5">
            <Zap size={14} className="text-green-500" />
            Trading partners
          </span>
          <div className="flex flex-col gap-1">
            {tradingPartners.map(p => (
              <button
                key={p.pubkey}
                onClick={() => selectPartner(p.pubkey, p.alias)}
                className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-2 text-sm hover:bg-muted/40 transition-colors text-left"
              >
                <span className="font-mono text-xs">
                  {p.alias || p.pubkey.slice(0, 16)}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-green-500 cursor-default">
                        Ready to trade
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      You already have both a BTC and an asset channel with this
                      peer — trades execute immediately without channel setup.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Minimum amount filter */}
      {selectedAsset && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Minimum trade amount"
              value={minAmountInput}
              onChange={e => setMinAmountInput(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-20"
            />
            {selectedSymbol && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {selectedSymbol}
              </span>
            )}
          </div>
        </div>
      )}

      {/* No asset selected */}
      {!selectedAsset && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Info className="mr-2" size={16} />
          Select an asset to see available offers
        </div>
      )}

      {/* Loading */}
      {selectedAsset && loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-muted-foreground" size={20} />
        </div>
      )}

      {/* Error */}
      {selectedAsset && error && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Info className="mr-2" size={16} />
          Unable to load offers
        </div>
      )}

      {/* Empty */}
      {selectedAsset &&
        !loading &&
        !error &&
        offers.length === 0 &&
        tradingPartners.length === 0 && (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Info className="mr-2" size={16} />
            No offers found for this asset. Try adjusting filters or check back
            later.
          </div>
        )}

      {/* Offers table */}
      {offers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-3 font-medium">
                  Routing Node
                </th>
                <th
                  className="text-left py-3 px-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort(TapOfferSortBy.Rate)}
                >
                  {selectedSymbol ? `BTC/${selectedSymbol}` : 'Rate'}
                  <SortIcon field={TapOfferSortBy.Rate} activeSortBy={sortBy} />
                </th>
                <th
                  className="text-left py-3 px-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort(TapOfferSortBy.Available)}
                >
                  Available
                  <SortIcon
                    field={TapOfferSortBy.Available}
                    activeSortBy={sortBy}
                  />
                </th>
                <th className="text-left py-3 px-3 font-medium">Channels</th>
                <th className="py-3 px-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => {
                const status = offer.node.pubkey
                  ? channelStatusByPubkey.get(offer.node.pubkey)
                  : undefined;
                return (
                  <tr
                    key={offer.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedOffer(offer)}
                  >
                    <td className="py-3 px-3 font-mono text-xs">
                      {offer.node.alias || offer.node.pubkey?.slice(0, 16)}
                    </td>
                    <td className="py-3 px-3">
                      {offer.rate.displayAmount || offer.rate.fullAmount}
                    </td>
                    <td className="py-3 px-3">
                      {Number(
                        offer.available.displayAmount ||
                          offer.available.fullAmount ||
                          0
                      ).toLocaleString()}
                      {selectedSymbol && (
                        <span className="text-muted-foreground ml-1">
                          {selectedSymbol}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {status ? (
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span
                            className={
                              status.btc === 'open'
                                ? 'text-green-500'
                                : status.btc === 'pending'
                                  ? 'text-yellow-500'
                                  : 'text-muted-foreground/40'
                            }
                          >
                            BTC
                          </span>
                          <span
                            className={
                              status.asset === 'open'
                                ? 'text-green-500'
                                : status.asset === 'pending'
                                  ? 'text-yellow-500'
                                  : 'text-muted-foreground/40'
                            }
                          >
                            {selectedSymbol || 'Asset'}
                          </span>
                          {(status.btc === 'pending' ||
                            status.asset === 'pending') && (
                            <Clock size={10} className="text-yellow-500" />
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/40">
                          none
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground/50">
                      <ChevronRight size={14} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {totalCount > offers.length && (
            <div className="text-xs text-muted-foreground text-center py-2">
              Showing {offers.length} of {totalCount} offers
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center pt-2">
        Trading powered by RailsX by Amboss
      </div>

      <TradeSheet
        offer={selectedOffer}
        ambossAssetId={selectedAsset}
        tapdAssetId={selectedAssetData?.assetId || ''}
        tapdGroupKey={selectedAssetData?.groupKey || ''}
        assetSymbol={selectedSymbol}
        assetPrecision={selectedPrecision}
        transactionType={txType}
        open={!!selectedOffer}
        onOpenChange={open => {
          if (!open) setSelectedOffer(null);
        }}
      />
    </div>
  );
};
