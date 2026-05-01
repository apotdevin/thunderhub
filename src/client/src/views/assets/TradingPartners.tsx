import { FC, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Zap, Loader2, Info } from 'lucide-react';
import { useGetTapOffersQuery } from '../../graphql/queries/__generated__/getTapOffers.generated';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetChannelsWithPeersQuery } from '../../graphql/queries/__generated__/getChannels.generated';
import { useGetTapAssetChannelBalancesQuery } from '../../graphql/queries/__generated__/getTapAssetChannelBalances.generated';
import { getErrorContent } from '../../utils/error';
import { cn } from '../../lib/utils';
import { TapBalanceGroupBy, TapTransactionType } from '../../graphql/types';
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

type PeerAssetInfo = {
  symbol: string;
  id: string;
  precision: number;
  assetId?: string | null;
  groupKey?: string | null;
};

export const TradingPartners: FC = () => {
  const { selectedAsset, txType, selectedOffer } = useTradingState();
  const dispatch = useTradingDispatch();

  const { data: supportedData, loading: supportedLoading } =
    useGetTapSupportedAssetsQuery({
      onError: err => toast.error(getErrorContent(err)),
    });

  const { data: balancesData, loading: balancesLoading } =
    useGetTapBalancesQuery({
      variables: { group_by: TapBalanceGroupBy.GroupKey },
    });

  const { data: allChannelsData, loading: channelsLoading } =
    useGetChannelsWithPeersQuery({
      variables: { active: true },
    });
  const { data: allAssetChannelsData, loading: assetChannelsLoading } =
    useGetTapAssetChannelBalancesQuery();

  const { data: buyOffersData } = useGetTapOffersQuery({
    variables: {
      input: {
        ambossAssetId: selectedAsset?.id,
        transactionType: TapTransactionType.Purchase,
      },
    },
  });

  const { data: sellOffersData } = useGetTapOffersQuery({
    variables: {
      input: {
        ambossAssetId: selectedAsset?.id,
        transactionType: TapTransactionType.Sale,
      },
    },
  });

  // Map "pubkey:ambossAssetId" -> offer (for rate/available data)
  const offersByPubkeyAsset = useMemo(() => {
    const map = new Map<
      string,
      { offer: NonNullable<typeof buyOffers>[number]; side: TapTransactionType }
    >();
    const buyOffers = buyOffersData?.magma?.get_tap_offers?.list || [];
    const sellOffers = sellOffersData?.magma?.get_tap_offers?.list || [];
    for (const o of buyOffers) {
      if (o.node.pubkey && o.asset?.id)
        map.set(`${o.node.pubkey}:${o.asset.id}`, {
          offer: o,
          side: TapTransactionType.Purchase,
        });
    }
    for (const o of sellOffers) {
      const key =
        o.node.pubkey && o.asset?.id ? `${o.node.pubkey}:${o.asset.id}` : '';
      if (key && !map.has(key))
        map.set(key, { offer: o, side: TapTransactionType.Sale });
    }
    return map;
  }, [buyOffersData, sellOffersData]);

  const loading =
    supportedLoading ||
    balancesLoading ||
    channelsLoading ||
    assetChannelsLoading;

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

  const assetPeersForSelectedAsset = useMemo(() => {
    if (selectedTapdGroupKey)
      return assetChannelsByGroupKey.get(selectedTapdGroupKey);
    if (selectedTapdAssetId)
      return assetChannelsByAssetId.get(selectedTapdAssetId);
    const all = new Set<string>();
    for (const peers of assetChannelsByGroupKey.values()) {
      for (const p of peers) all.add(p);
    }
    for (const peers of assetChannelsByAssetId.values()) {
      for (const p of peers) all.add(p);
    }
    return all.size > 0 ? all : undefined;
  }, [
    selectedTapdGroupKey,
    selectedTapdAssetId,
    assetChannelsByGroupKey,
    assetChannelsByAssetId,
  ]);

  const peerAssets = useMemo(() => {
    const map = new Map<string, PeerAssetInfo[]>();
    const assetChannels =
      allAssetChannelsData?.taproot_assets?.get_asset_channel_balances || [];
    for (const ac of assetChannels) {
      const key = ac.group_key || ac.asset_id;
      const supported = allSupported.find(
        a => a.groupKey === key || a.assetId === key
      );
      const info: PeerAssetInfo = {
        symbol: supported?.symbol || ac.asset_name || key.slice(0, 8),
        id: supported?.id || '',
        precision: supported?.precision ?? 0,
        assetId: supported?.assetId || ac.asset_id,
        groupKey: supported?.groupKey || ac.group_key,
      };
      const existing = map.get(ac.partner_public_key);
      if (existing) {
        if (!existing.some(a => a.symbol === info.symbol)) existing.push(info);
      } else {
        map.set(ac.partner_public_key, [info]);
      }
    }
    return map;
  }, [allAssetChannelsData, allSupported]);

  const tradingPartners = useMemo(() => {
    if (!assetPeersForSelectedAsset) return [];
    return Array.from(assetPeersForSelectedAsset).map(pubkey => ({
      pubkey,
      alias: aliasMap.get(pubkey) || null,
      assets: peerAssets.get(pubkey) || [],
    }));
  }, [assetPeersForSelectedAsset, aliasMap, peerAssets]);

  const selectPartner = (
    pubkey: string,
    alias: string | null,
    partnerAssets: PeerAssetInfo[]
  ) => {
    const fallback = partnerAssets[0];
    const assetId = selectedAsset?.id || fallback?.id || '';
    const match = offersByPubkeyAsset.get(`${pubkey}:${assetId}`);
    const o = match?.offer;

    if (match) {
      dispatch({ type: 'setTxType', txType: match.side });
    }

    dispatch({
      type: 'selectOffer',
      offer: {
        id: `partner-${pubkey}`,
        magmaOfferId: '',
        node: { alias, pubkey, sockets: o?.node.sockets || [] },
        rate: o?.rate ?? { displayAmount: null, fullAmount: null },
        available: o?.available ?? { displayAmount: null, fullAmount: null },
        minOrder: o?.minOrder ?? { displayAmount: null, fullAmount: null },
        maxOrder: o?.maxOrder ?? { displayAmount: null, fullAmount: null },
        fees: o?.fees ?? { baseFeeSats: 0, feeRatePpm: 0 },
        asset: {
          id: selectedAsset?.id || o?.asset?.id || fallback?.id || '',
          symbol: selectedSymbol || o?.asset?.symbol || fallback?.symbol || '',
          precision:
            selectedAsset?.precision ??
            o?.asset?.precision ??
            fallback?.precision ??
            0,
          assetId:
            selectedAsset?.assetId ?? o?.asset?.assetId ?? fallback?.assetId,
          groupKey:
            selectedAsset?.groupKey ?? o?.asset?.groupKey ?? fallback?.groupKey,
        },
      },
    });
  };

  const hasSelectedAsset = !!selectedAsset;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  if (tradingPartners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Zap size={20} className="text-muted-foreground/30 mb-2" />
        <p className="text-xs text-muted-foreground">
          No trading partners found
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          Open both a BTC and an asset channel with a peer to trade directly
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {tradingPartners.map(p => (
        <button
          key={p.pubkey}
          onClick={() => selectPartner(p.pubkey, p.alias, p.assets)}
          className={cn(
            'flex items-center justify-between rounded-md border px-3 py-1.5 text-sm transition-colors text-left',
            selectedOffer?.node.pubkey === p.pubkey &&
              selectedOffer?.id.startsWith('partner-')
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
                  {!hasSelectedAsset && p.assets.length > 0
                    ? p.assets.map(a => a.symbol).join(', ')
                    : 'Ready to trade'}
                </span>
              </TooltipTrigger>
              <TooltipContent side="left">
                You already have both a BTC and an asset channel with this peer
                — trades execute immediately without channel setup.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </button>
      ))}
      <p className="text-[10px] text-muted-foreground/50 text-center mt-1">
        <Info size={10} className="inline mr-1" />
        Peers with both BTC and asset channels
      </p>
    </div>
  );
};
