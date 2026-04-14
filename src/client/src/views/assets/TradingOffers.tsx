import { FC, Fragment, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Loader2,
  Info,
  ArrowUpDown,
  Zap,
  CheckCircle2,
  Circle,
  ChevronRight,
} from 'lucide-react';
import { useGetTapOffersQuery } from '../../graphql/queries/__generated__/getTapOffers.generated';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetChannelsWithPeersQuery } from '../../graphql/queries/__generated__/getChannels.generated';
import { useGetTapAssetChannelBalancesQuery } from '../../graphql/queries/__generated__/getTapAssetChannelBalances.generated';
import { useLoginAmbossMutation } from '../../graphql/mutations/__generated__/loginAmboss.generated';
import { useLogoutAmbossMutation } from '../../graphql/mutations/__generated__/logoutAmboss.generated';
import { useAmbossUser } from '../../hooks/UseAmbossUser';
import { getErrorContent } from '../../utils/error';
import { cn } from '../../lib/utils';
import { Button } from '@/components/ui/button';
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

  const { user: ambossUser, loading: ambossLoading } = useAmbossUser();

  const [loginAmboss, { loading: loginLoading }] = useLoginAmbossMutation({
    onCompleted: () => toast.success('Logged in to Amboss'),
    onError: () => toast.error('Error logging in to Amboss'),
    refetchQueries: ['GetAmbossUser', 'GetTapSupportedAssets', 'GetTapOffers'],
  });

  const [logoutAmboss, { loading: logoutLoading }] = useLogoutAmbossMutation({
    onCompleted: () => toast.success('Logged out of Amboss'),
    onError: () => toast.error('Error logging out of Amboss'),
    refetchQueries: ['GetAmbossUser', 'GetTapSupportedAssets'],
  });

  const { data: supportedData, loading: assetsLoading } =
    useGetTapSupportedAssetsQuery({
      onError: err => toast.error(getErrorContent(err)),
    });

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { groupBy: TapBalanceGroupBy.GroupKey },
  });

  const { data: allChannelsData } = useGetChannelsWithPeersQuery({
    variables: { active: true },
  });
  const { data: allAssetChannelsData } = useGetTapAssetChannelBalancesQuery();

  const allSupported = supportedData?.getTapSupportedAssets?.list || [];
  const balances = balancesData?.getTapBalances?.balances || [];
  const ownedGroupKeys = new Set(
    balances.filter(b => b.groupKey).map(b => b.groupKey!)
  );
  const ownedAssetIds = new Set(
    balances.filter(b => !b.groupKey && b.assetId).map(b => b.assetId!)
  );

  // Build asset channel data for trading partner detection
  const assetChannelsByAssetId = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const ac of allAssetChannelsData?.getTapAssetChannelBalances || []) {
      if (!map.has(ac.assetId)) map.set(ac.assetId, new Set());
      map.get(ac.assetId)?.add(ac.partnerPublicKey);
    }
    return map;
  }, [allAssetChannelsData]);

  const btcChannelPubkeys = useMemo(() => {
    const assetChannelCountByPubkey = new Map<string, number>();
    for (const ac of allAssetChannelsData?.getTapAssetChannelBalances || []) {
      assetChannelCountByPubkey.set(
        ac.partnerPublicKey,
        (assetChannelCountByPubkey.get(ac.partnerPublicKey) || 0) + 1
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

  // For SALE, show assets the node owns (match by group key or asset ID) OR has asset channels for
  const supportedAssets =
    txType === TapTransactionType.Sale
      ? allSupported.filter(
          a =>
            (a.groupKey && ownedGroupKeys.has(a.groupKey)) ||
            (!a.groupKey && a.assetId && ownedAssetIds.has(a.assetId)) ||
            (a.assetId && assetChannelAssetIds.has(a.assetId))
        )
      : allSupported;

  const selectedAssetData = supportedAssets.find(a => a.id === selectedAsset);
  const selectedSymbol = selectedAssetData?.symbol || '';
  const selectedPrecision = selectedAssetData?.precision ?? 0;
  const selectedTapdAssetId = selectedAssetData?.assetId || '';

  // Find trading partners: peers with both BTC + asset channels for selected asset
  const tradingPartners = useMemo(() => {
    if (!selectedTapdAssetId) return [];
    const assetPeers = assetChannelsByAssetId.get(selectedTapdAssetId);
    if (!assetPeers) return [];
    return Array.from(assetPeers)
      .filter(pubkey => btcChannelPubkeys.has(pubkey))
      .map(pubkey => ({
        pubkey,
        alias: aliasMap.get(pubkey) || null,
      }));
  }, [
    selectedTapdAssetId,
    assetChannelsByAssetId,
    btcChannelPubkeys,
    aliasMap,
  ]);

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

  const offers = offersData?.getTapOffers?.list || [];
  const totalCount = offersData?.getTapOffers?.totalCount || 0;

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

  const SortIcon: FC<{ field: TapOfferSortBy }> = ({ field }) => (
    <ArrowUpDown
      size={12}
      className={cn(
        'inline ml-1',
        sortBy === field ? 'text-foreground' : 'text-muted-foreground/40'
      )}
    />
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Step guide */}
      {!selectedOffer && (
        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          {(
            [
              {
                label: 'Login',
                done: !!ambossUser || allSupported.length > 0,
                active: !ambossUser && allSupported.length === 0,
              },
              {
                label: 'Select asset',
                done: !!selectedAsset,
                active:
                  (!!ambossUser || allSupported.length > 0) && !selectedAsset,
              },
              {
                label: 'Select offer',
                done: false,
                active:
                  (!!ambossUser || allSupported.length > 0) && !!selectedAsset,
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

      {/* Amboss login prompt */}
      {!ambossUser && !ambossLoading && (
        <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info size={16} />
            Log in with Amboss to access trading offers
          </div>
          <Button
            size="sm"
            onClick={() => loginAmboss()}
            disabled={loginLoading}
          >
            {loginLoading ? 'Logging in...' : 'Login with Amboss'}
          </Button>
        </div>
      )}

      {/* Amboss logout */}
      {(!!ambossUser || allSupported.length > 0) && (
        <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info size={16} />
            Connected to Amboss
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => logoutAmboss()}
            disabled={logoutLoading}
          >
            {logoutLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      )}

      {/* Buy / Sell toggle + Asset pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex rounded-md overflow-hidden border border-border">
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
                    selected?.assetId &&
                    assetChannelAssetIds.has(selected.assetId);
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

        <div className="flex gap-1 ml-2 items-center">
          {assetsLoading ? (
            <Loader2 className="animate-spin text-muted-foreground" size={16} />
          ) : supportedAssets.length === 0 &&
            txType === TapTransactionType.Sale ? (
            <span className="text-sm text-muted-foreground">
              You don't have any supported assets to sell
            </span>
          ) : (
            supportedAssets.map(a => {
              const value = a.id;
              const label = a.symbol || a.id.slice(0, 8);
              const isActive = selectedAsset === value;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAsset(value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {label}
                </button>
              );
            })
          )}
        </div>
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

      {/* Trade amount input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Min trade amount"
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
                  {selectedSymbol ? `${selectedSymbol}/BTC` : 'Rate'}
                  <SortIcon field={TapOfferSortBy.Rate} />
                </th>
                <th
                  className="text-left py-3 px-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort(TapOfferSortBy.Available)}
                >
                  Available
                  <SortIcon field={TapOfferSortBy.Available} />
                </th>
                <th className="py-3 px-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
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
                  <td className="py-3 px-3 text-muted-foreground/50">
                    <ChevronRight size={14} />
                  </td>
                </tr>
              ))}
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
        Trading powered by RailsX By Amboss
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
