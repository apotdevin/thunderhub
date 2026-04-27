import { FC, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Info, ArrowUpDown, Zap, ChevronRight } from 'lucide-react';
import { useGetTapOffersQuery } from '../../graphql/queries/__generated__/getTapOffers.generated';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetChannelsWithPeersQuery } from '../../graphql/queries/__generated__/getChannels.generated';
import { useGetTapAssetChannelBalancesQuery } from '../../graphql/queries/__generated__/getTapAssetChannelBalances.generated';
import { getErrorContent } from '../../utils/error';
import { cn } from '../../lib/utils';
import {
  TapBalanceGroupBy,
  TapTransactionType,
  TapOfferSortBy,
  TapOfferSortDir,
} from '../../graphql/types';
import {
  useTradingState,
  useTradingDispatch,
} from '../../context/TradingContext';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const formatRate = (raw: string | null | undefined): string => {
  if (!raw) return '—';
  const num = Number(raw);
  if (isNaN(num)) return raw;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatAmount = (raw: string | null | undefined): string => {
  if (!raw) return '—';
  const num = Number(raw);
  if (isNaN(num)) return raw;
  return num.toLocaleString();
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
  const { selectedAsset, txType, selectedOffer } = useTradingState();
  const dispatch = useTradingDispatch();

  const [sortBy, setSortBy] = useState<TapOfferSortBy>(TapOfferSortBy.Rate);
  const [sortDir, setSortDir] = useState<TapOfferSortDir>(TapOfferSortDir.Asc);

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

  const allSupported =
    supportedData?.rails?.get_tap_supported_assets?.list || [];
  const balances = balancesData?.taproot_assets?.get_balances?.balances || [];
  const ownedGroupKeys = new Set(
    balances.filter(b => b.group_key).map(b => b.group_key!)
  );
  const ownedAssetIds = new Set(
    balances.filter(b => !b.group_key && b.asset_id).map(b => b.asset_id!)
  );

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

  const selectedAssetData = supportedAssets.find(
    a => a.id === selectedAsset?.id
  );
  const selectedSymbol = selectedAssetData?.symbol || '';
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
        ambossAssetId: selectedAsset?.id,
        transactionType: txType,
        sortBy,
        sortDir,
      },
    },
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

  const handleSelectAsset = (assetId: string) => {
    if (assetId === '__all__') {
      dispatch({ type: 'selectAsset', asset: null });
      return;
    }
    const asset = supportedAssets.find(a => a.id === assetId);
    if (asset) {
      dispatch({
        type: 'selectAsset',
        asset: {
          id: asset.id,
          symbol: asset.symbol,
          precision: asset.precision,
          assetId: asset.assetId,
          groupKey: asset.groupKey,
        },
      });
    }
  };

  const selectPartner = (pubkey: string, alias: string | null) => {
    dispatch({
      type: 'selectOffer',
      offer: {
        id: `partner-${pubkey}`,
        magmaOfferId: '',
        node: { alias, pubkey, sockets: [] },
        rate: { displayAmount: null, fullAmount: null },
        available: { displayAmount: null, fullAmount: null },
        minOrder: { displayAmount: null, fullAmount: null },
        maxOrder: { displayAmount: null, fullAmount: null },
        fees: { baseFeeSats: 0, feeRatePpm: 0 },
        asset: {
          id: selectedAsset?.id || '',
          symbol: selectedSymbol,
          precision: selectedAsset?.precision ?? 0,
          assetId: selectedAsset?.assetId,
          groupKey: selectedAsset?.groupKey,
        },
      },
    });
  };

  const hasSelectedAsset = !!selectedAsset;

  return (
    <div className="flex flex-col gap-3">
      {/* Controls row: Asset selector, Min amount */}
      <div className="flex items-center gap-3 flex-wrap">
        {assetsLoading ? (
          <Loader2 className="animate-spin text-muted-foreground" size={16} />
        ) : (
          <Select
            value={selectedAsset?.id || '__all__'}
            onValueChange={handleSelectAsset}
          >
            <SelectTrigger className="w-36 rounded-md h-8! px-3 text-sm font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="rounded-md w-(--radix-select-trigger-width)"
            >
              <SelectItem value="__all__">All assets</SelectItem>
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
      {hasSelectedAsset && tradingPartners.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Zap size={12} className="text-green-500" />
            Trading partners
          </span>
          <div className="flex flex-col gap-1">
            {tradingPartners.map(p => (
              <button
                key={p.pubkey}
                onClick={() => selectPartner(p.pubkey, p.alias)}
                className={cn(
                  'flex items-center justify-between rounded-md border px-3 py-1.5 text-sm transition-colors text-left',
                  selectedOffer?.node.pubkey === p.pubkey
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-muted/20 hover:bg-muted/40'
                )}
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

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-muted-foreground" size={20} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Info className="mr-2" size={16} />
          Unable to load offers
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        offers.length === 0 &&
        tradingPartners.length === 0 && (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Info className="mr-2" size={16} />
            No offers found. Try adjusting filters or check back later.
          </div>
        )}

      {/* Offers table */}
      {offers.length > 0 && (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Node</TableHead>
                {!hasSelectedAsset && <TableHead>Asset</TableHead>}
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => toggleSort(TapOfferSortBy.Rate)}
                >
                  {selectedSymbol ? `${selectedSymbol}/BTC` : 'Rate'}
                  <SortIcon field={TapOfferSortBy.Rate} activeSortBy={sortBy} />
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => toggleSort(TapOfferSortBy.Available)}
                >
                  Available
                  <SortIcon
                    field={TapOfferSortBy.Available}
                    activeSortBy={sortBy}
                  />
                </TableHead>
                <TableHead className="text-right">Min / Max</TableHead>
                <TableHead className="w-6" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map(offer => {
                const symbol = selectedSymbol || offer.asset?.symbol || '';
                return (
                  <TableRow
                    key={offer.id}
                    className={cn(
                      'cursor-pointer',
                      selectedOffer?.id === offer.id && 'bg-primary/5'
                    )}
                    onClick={() => dispatch({ type: 'selectOffer', offer })}
                  >
                    <TableCell className="font-mono">
                      {offer.node.alias || offer.node.pubkey?.slice(0, 16)}
                    </TableCell>
                    {!hasSelectedAsset && (
                      <TableCell>{offer.asset?.symbol || '—'}</TableCell>
                    )}
                    <TableCell className="text-right tabular-nums">
                      {formatRate(
                        offer.rate.displayAmount || offer.rate.fullAmount
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatAmount(
                        offer.available.displayAmount ||
                          offer.available.fullAmount
                      )}
                      {symbol && (
                        <span className="text-muted-foreground ml-1">
                          {symbol}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {formatAmount(
                        offer.minOrder.displayAmount ||
                          offer.minOrder.fullAmount
                      )}
                      {' – '}
                      {formatAmount(
                        offer.maxOrder.displayAmount ||
                          offer.maxOrder.fullAmount
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground/40">
                      <ChevronRight size={14} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {totalCount > offers.length && (
            <div className="text-xs text-muted-foreground text-center py-1.5 border-t border-border/40">
              Showing {offers.length} of {totalCount}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
