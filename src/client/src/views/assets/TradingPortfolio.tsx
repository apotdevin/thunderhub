import { FC, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetTapAssetChannelBalancesQuery } from '../../graphql/queries/__generated__/getTapAssetChannelBalances.generated';
import { useGetNodeBalancesQuery } from '../../graphql/queries/__generated__/getNodeBalances.generated';
import { TapBalanceGroupBy } from '../../graphql/types';
import { cn } from '@/lib/utils';

type AggregatedAsset = {
  name: string;
  precision: number;
  onChain: number;
  inLightning: number;
};

export const TradingPortfolio: FC = () => {
  const { data: balancesData, loading: balancesLoading } =
    useGetTapBalancesQuery({
      variables: { group_by: TapBalanceGroupBy.GroupKey },
    });

  const { data: channelData, loading: channelsLoading } =
    useGetTapAssetChannelBalancesQuery();

  const { data: nodeBalancesData, loading: nodeBalancesLoading } =
    useGetNodeBalancesQuery();

  const assets = useMemo(() => {
    const map = new Map<string, AggregatedAsset>();

    for (const b of balancesData?.taproot_assets?.get_balances?.balances ||
      []) {
      const key = b.group_key || b.asset_id || '';
      const name = b.names?.[0] || key.slice(0, 8);
      const existing = map.get(key);
      if (existing) {
        existing.onChain += Number(b.balance) || 0;
      } else {
        map.set(key, {
          name,
          precision: b.precision,
          onChain: Number(b.balance) || 0,
          inLightning: 0,
        });
      }
    }

    for (const ac of channelData?.taproot_assets?.get_asset_channel_balances ||
      []) {
      const key = ac.group_key || ac.asset_id;
      const existing = map.get(key);
      if (existing) {
        existing.inLightning += Number(ac.local_balance) || 0;
      } else {
        map.set(key, {
          name: ac.asset_name || key.slice(0, 8),
          precision: ac.asset_precision,
          onChain: 0,
          inLightning: Number(ac.local_balance) || 0,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const totalA = a.onChain + a.inLightning;
      const totalB = b.onChain + b.inLightning;
      return totalB - totalA;
    });
  }, [balancesData, channelData]);

  const btcOnChain = Number(
    nodeBalancesData?.getNodeBalances?.onchain?.confirmed || 0
  );
  const btcLightning = Number(
    nodeBalancesData?.getNodeBalances?.lightning?.active || 0
  );
  const btcTotal = btcOnChain + btcLightning;
  const btcChannelPct = btcTotal > 0 ? (btcLightning / btcTotal) * 100 : 0;

  const loading = balancesLoading || channelsLoading || nodeBalancesLoading;

  if (loading && assets.length === 0 && btcTotal === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  const formatBalance = (raw: number, precision: number) => {
    if (precision > 0) {
      const display = raw / Math.pow(10, precision);
      return display.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: precision,
      });
    }
    return raw.toLocaleString();
  };

  return (
    <div className="flex flex-col gap-2">
      {/* BTC */}
      <div className="flex flex-col gap-1.5 rounded-md border border-border/60 px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">BTC</span>
          <span className="text-sm tabular-nums font-medium">
            {btcTotal.toLocaleString()} sats
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full bg-primary transition-all',
              btcChannelPct > 0 && btcChannelPct < 100 && 'rounded-r-none'
            )}
            style={{ width: `${100 - btcChannelPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>On-chain: {btcOnChain.toLocaleString()} sats</span>
          <span>Lightning: {btcLightning.toLocaleString()} sats</span>
        </div>
      </div>

      {/* Taproot Assets */}
      {assets.map(asset => {
        const total = asset.onChain + asset.inLightning;
        const channelPct = total > 0 ? (asset.inLightning / total) * 100 : 0;

        return (
          <div
            key={asset.name}
            className="flex flex-col gap-1.5 rounded-md border border-border/60 px-3 py-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate">{asset.name}</span>
              <span className="text-sm tabular-nums font-medium">
                {formatBalance(total, asset.precision)}
              </span>
            </div>

            {/* Balance bar */}
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full bg-primary transition-all',
                  channelPct > 0 && channelPct < 100 && 'rounded-r-none'
                )}
                style={{ width: `${100 - channelPct}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>
                On-chain: {formatBalance(asset.onChain, asset.precision)}
              </span>
              <span>
                Lightning: {formatBalance(asset.inLightning, asset.precision)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
