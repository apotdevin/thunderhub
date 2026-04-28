import { FC, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetTapAssetChannelBalancesQuery } from '../../graphql/queries/__generated__/getTapAssetChannelBalances.generated';
import { useGetNodeBalancesQuery } from '../../graphql/queries/__generated__/getNodeBalances.generated';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { usePriceState } from '../../context/PriceContext';
import { TapBalanceGroupBy } from '../../graphql/types';

const COLORS = [
  'bg-orange-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-cyan-500',
  'bg-rose-500',
];

type Slice = {
  name: string;
  sats: number;
  pct: number;
  color: string;
};

const formatSats = (sats: number): string => {
  if (sats >= 1e8) return `${(sats / 1e8).toFixed(2)} BTC`;
  return `${Math.round(sats).toLocaleString()} sats`;
};

export const TradingDistribution: FC = () => {
  const { data: balancesData, loading: balancesLoading } =
    useGetTapBalancesQuery({
      variables: { group_by: TapBalanceGroupBy.GroupKey },
    });

  const { data: channelData, loading: channelsLoading } =
    useGetTapAssetChannelBalancesQuery();

  const { data: nodeBalancesData, loading: nodeBalancesLoading } =
    useGetNodeBalancesQuery();

  const { data: supportedData, loading: supportedLoading } =
    useGetTapSupportedAssetsQuery();

  const { prices, dontShow } = usePriceState();
  const btcPriceUsd = prices?.['USD']?.last || 0;

  const btcOnChain =
    Number(nodeBalancesData?.getNodeBalances?.onchain?.confirmed) || 0;
  const btcLightning =
    Number(nodeBalancesData?.getNodeBalances?.lightning?.active) || 0;
  const btcTotalSats = btcOnChain + btcLightning;

  const slices = useMemo(() => {
    if (!btcPriceUsd) return [];

    const supportedAssets =
      supportedData?.rails?.get_tap_supported_assets?.list || [];

    // Build a map of asset key -> { usdPrice, precision, symbol }
    const priceMap = new Map<
      string,
      { usdPrice: number; precision: number; symbol: string }
    >();
    for (const a of supportedAssets) {
      const usdPrice = a.prices?.usd;
      if (usdPrice == null) continue;
      const key = a.groupKey || a.assetId || '';
      if (key) {
        priceMap.set(key, {
          usdPrice,
          precision: a.precision,
          symbol: a.symbol,
        });
      }
    }

    // Aggregate raw balances per asset key
    const rawBalances = new Map<string, number>();

    for (const b of balancesData?.taproot_assets?.get_balances?.balances ||
      []) {
      const key = b.group_key || b.asset_id || '';
      rawBalances.set(
        key,
        (rawBalances.get(key) || 0) + (Number(b.balance) || 0)
      );
    }

    for (const ac of channelData?.taproot_assets?.get_asset_channel_balances ||
      []) {
      const key = ac.group_key || ac.asset_id;
      rawBalances.set(
        key,
        (rawBalances.get(key) || 0) + (Number(ac.local_balance) || 0)
      );
    }

    // Convert asset balances to sats via USD prices
    // asset USD value = displayBalance * assetUsdPrice
    // asset sats value = (assetUsdValue / btcPriceUsd) * 1e8
    const satsPerUsd = 1e8 / btcPriceUsd;

    const items: { name: string; sats: number }[] = [];
    if (btcTotalSats > 0) {
      items.push({ name: 'BTC', sats: btcTotalSats });
    }

    for (const [key, rawBalance] of rawBalances) {
      const info = priceMap.get(key);
      if (!info || rawBalance <= 0) continue;
      const displayBalance =
        info.precision > 0
          ? rawBalance / Math.pow(10, info.precision)
          : rawBalance;
      const assetSats = displayBalance * info.usdPrice * satsPerUsd;
      if (assetSats > 0) {
        items.push({ name: info.symbol, sats: assetSats });
      }
    }

    const totalSats = items.reduce((s, i) => s + i.sats, 0);
    if (totalSats === 0) return [];

    return items
      .sort((a, b) => b.sats - a.sats)
      .map<Slice>((item, i) => ({
        name: item.name,
        sats: item.sats,
        pct: (item.sats / totalSats) * 100,
        color: COLORS[i % COLORS.length],
      }));
  }, [balancesData, channelData, btcTotalSats, btcPriceUsd, supportedData]);

  const loading =
    balancesLoading ||
    channelsLoading ||
    nodeBalancesLoading ||
    supportedLoading;

  if (loading && slices.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  if (slices.length === 0 || dontShow) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-muted-foreground">
          {dontShow
            ? 'Enable price fetching to see distribution'
            : 'No balances'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Stacked bar */}
      <div className="flex h-3 w-full rounded-full overflow-hidden">
        {slices.map((s, i) => (
          <div
            key={s.name}
            className={`${s.color} transition-all`}
            style={{
              width: `${s.pct}%`,
              marginLeft: i > 0 ? '1px' : undefined,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {slices.map(s => (
          <div key={s.name} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${s.color}`} />
            <span className="text-xs truncate">{s.name}</span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {s.pct.toFixed(1)}% · {formatSats(s.sats)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
