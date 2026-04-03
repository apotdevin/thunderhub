import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { useGetNodeBalancesQuery } from '../../graphql/queries/__generated__/getNodeBalances.generated';
import { usePriceState } from '../../context/PriceContext';
import { TapBalanceGroupBy } from '../../graphql/types';

const ASSET_COLORS: Record<string, string> = {
  BTC: '#FB923C',
  USDT: '#4ADE80',
  USDC: '#2563EB',
  EURX: '#7C19F7',
};

const FALLBACK_COLORS = ['#94A3B8', '#F472B6', '#34D399', '#FBBF24'];

const formatUsd = (n: number) =>
  n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

type PortfolioAsset = {
  symbol: string;
  usdValue: number;
  percentage: number;
  color: string;
};

export const PortfolioDistribution: FC = () => {
  const { prices, dontShow } = usePriceState();

  const { data: balancesData, loading: balancesLoading } =
    useGetTapBalancesQuery({
      variables: { groupBy: TapBalanceGroupBy.GroupKey },
    });

  const { data: supportedData, loading: supportedLoading } =
    useGetTapSupportedAssetsQuery();

  const { data: nodeData, loading: nodeLoading } = useGetNodeBalancesQuery();

  if (balancesLoading || supportedLoading || nodeLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Portfolio Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="animate-pulse bg-muted h-4 w-full rounded-sm" />
          <div className="flex flex-col gap-1.5">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="animate-pulse bg-muted h-3 rounded-sm"
                style={{ width: `${60 + i * 10}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Build price map keyed by assetId and groupKey
  const priceMap = new Map<
    string,
    { usd: number; precision: number; symbol: string }
  >();
  for (const asset of supportedData?.getTapSupportedAssets?.list || []) {
    const price = asset.prices?.usd;
    if (price == null) continue;
    const entry = {
      usd: price,
      precision: asset.precision,
      symbol: asset.symbol,
    };
    if (asset.assetId) priceMap.set(asset.assetId, entry);
    if (asset.groupKey) priceMap.set(asset.groupKey, entry);
  }

  // Compute taproot asset USD values
  const tapAssets: Omit<PortfolioAsset, 'percentage'>[] = [];
  let fallbackIndex = 0;

  for (const entry of balancesData?.getTapBalances?.balances || []) {
    const priceEntry =
      priceMap.get(entry.groupKey || '') || priceMap.get(entry.assetId || '');
    if (!priceEntry || !entry.balance) continue;

    const usdValue =
      (Number(entry.balance) / 10 ** priceEntry.precision) * priceEntry.usd;
    if (usdValue <= 0) continue;

    const symbol = priceEntry.symbol || entry.names?.[0] || 'Unknown';
    const color =
      ASSET_COLORS[symbol] ??
      FALLBACK_COLORS[fallbackIndex++ % FALLBACK_COLORS.length];

    tapAssets.push({ symbol, usdValue, color });
  }

  // Only render if there are taproot assets with USD prices
  if (tapAssets.length === 0) return null;

  // Compute BTC USD value
  const btcUsdPrice = !dontShow ? (prices?.['USD']?.last ?? 0) : 0;
  const btcSats =
    Number(nodeData?.getNodeBalances?.lightning?.active ?? 0) +
    Number(nodeData?.getNodeBalances?.onchain?.confirmed ?? 0);
  const btcUsdValue =
    btcSats > 0 && btcUsdPrice > 0 ? (btcSats / 1e8) * btcUsdPrice : 0;

  const allAssets: Omit<PortfolioAsset, 'percentage'>[] = [
    ...(btcUsdValue > 0
      ? [{ symbol: 'BTC', usdValue: btcUsdValue, color: ASSET_COLORS['BTC'] }]
      : []),
    ...tapAssets,
  ];

  const totalUsd = allAssets.reduce((sum, a) => sum + a.usdValue, 0);
  if (totalUsd === 0) return null;

  const items: PortfolioAsset[] = allAssets
    .sort((a, b) => b.usdValue - a.usdValue)
    .map(a => ({ ...a, percentage: (a.usdValue / totalUsd) * 100 }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Portfolio Distribution
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          Total: ${formatUsd(totalUsd)}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <TooltipProvider>
          <div className="flex h-2 w-full overflow-hidden gap-px">
            {items.map(asset => (
              <Tooltip key={asset.symbol}>
                <TooltipTrigger asChild>
                  <div
                    style={{
                      width: `${asset.percentage}%`,
                      minWidth: '2px',
                      backgroundColor: asset.color,
                    }}
                    className="h-full transition-opacity hover:opacity-80 cursor-default"
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  {asset.symbol}: ${formatUsd(asset.usdValue)} (
                  {asset.percentage.toFixed(1)}%)
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        <div className="flex flex-col gap-1.5">
          {items.map(asset => (
            <div
              key={asset.symbol}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: asset.color }}
                />
                <span className="font-medium">{asset.symbol}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span>${formatUsd(asset.usdValue)}</span>
                <span className="w-12 text-right">
                  {asset.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
