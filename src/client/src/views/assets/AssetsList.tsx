import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Info, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetTapAssetsQuery } from '../../graphql/queries/__generated__/getTapAssets.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { useGetTapAssetChannelBalancesQuery } from '../../graphql/queries/__generated__/getTapAssetChannelBalances.generated';
import { TapBalanceGroupBy } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';
import { cn } from '../../lib/utils';

const CopyableKey: FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground font-mono truncate max-w-[250px]">
        {value}
      </span>
      <button
        onClick={handleCopy}
        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        title={`Copy ${label}`}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  );
};

export const AssetsList: FC = () => {
  const [groupBy, setGroupBy] = useState(TapBalanceGroupBy.GroupKey);

  const {
    data: assetsData,
    loading: assetsLoading,
    error: assetsError,
  } = useGetTapAssetsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const { data: balancesData, loading: balancesLoading } =
    useGetTapBalancesQuery({
      variables: { group_by: groupBy },
      onError: error => toast.error(getErrorContent(error)),
    });

  const { data: supportedData } = useGetTapSupportedAssetsQuery();

  const { data: channelsData, loading: channelsLoading } =
    useGetTapAssetChannelBalancesQuery({
      fetchPolicy: 'cache-and-network',
      onError: error => toast.error(getErrorContent(error)),
    });

  const channels =
    channelsData?.taproot_assets?.get_asset_channel_balances || [];

  const priceMap = new Map<string, { usd: number; precision: number }>();
  const supportedKeys = new Set<string>();
  for (const asset of supportedData?.rails?.get_tap_supported_assets?.list ||
    []) {
    const price = asset.prices?.usd;
    if (price != null) {
      const entry = { usd: price, precision: asset.precision };
      if (asset.assetId) priceMap.set(asset.assetId, entry);
      if (asset.groupKey) priceMap.set(asset.groupKey, entry);
    }
    if (asset.assetId) supportedKeys.add(asset.assetId);
    if (asset.groupKey) supportedKeys.add(asset.groupKey);
  }

  if (assetsLoading || balancesLoading || channelsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  if (assetsError) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Info className="mr-2" size={16} />
        Unable to load assets. Make sure you are connected via litd.
      </div>
    );
  }

  const assets = assetsData?.taproot_assets?.get_assets?.assets || [];
  const balances = balancesData?.taproot_assets?.get_balances?.balances || [];

  // Aggregate channel balances by group_key (or asset_id)
  const channelBalanceMap = new Map<
    string,
    { key: string; name: string; balance: number }
  >();
  for (const ch of channels) {
    const key = ch.group_key || ch.asset_id;
    const existing = channelBalanceMap.get(key);
    const localBal = Number(ch.local_balance) || 0;
    if (existing) {
      channelBalanceMap.set(key, {
        ...existing,
        balance: existing.balance + localBal,
      });
    } else {
      const name =
        ch.asset_name ||
        balances.find(b => b.group_key === key || b.asset_id === key)
          ?.names?.[0] ||
        'Unknown';
      channelBalanceMap.set(key, { key, name, balance: localBal });
    }
  }
  const channelBalances = [...channelBalanceMap.values()].filter(
    b => b.balance > 0
  );

  if (assets.length === 0 && balances.length === 0 && channels.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Info className="mr-2" size={16} />
        No assets found. Mint your first asset to get started.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Group by:</span>
        <div className="flex gap-1">
          {Object.values(TapBalanceGroupBy).map(option => (
            <Button
              key={option}
              variant={groupBy === option ? 'default' : 'outline'}
              size="sm"
              className={cn('text-xs h-7')}
              onClick={() => setGroupBy(option)}
            >
              {option === TapBalanceGroupBy.GroupKey ? 'Group Key' : 'Asset ID'}
            </Button>
          ))}
        </div>
      </div>

      {balances.length > 0 && (
        <div className="grid gap-3">
          {balances.map((entry, i) => {
            const keyValue =
              groupBy === TapBalanceGroupBy.GroupKey
                ? entry.group_key || entry.asset_id
                : entry.asset_id;
            const keyLabel =
              groupBy === TapBalanceGroupBy.GroupKey ? 'Group key' : 'Asset ID';

            const priceEntry =
              priceMap.get(entry.group_key || '') ||
              priceMap.get(entry.asset_id || '');
            const usdValue =
              priceEntry && entry.balance
                ? (Number(entry.balance) / 10 ** priceEntry.precision) *
                  priceEntry.usd
                : null;

            const isAmbossListed =
              supportedKeys.has(entry.asset_id || '') ||
              supportedKeys.has(entry.group_key || '');

            return (
              <Card key={`${keyValue}-${i}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {entry.names?.length
                            ? entry.names.join(', ')
                            : 'Unknown'}
                        </span>
                        {isAmbossListed && (
                          <Badge variant="outline" className="text-primary">
                            Amboss Listed
                          </Badge>
                        )}
                      </div>
                      {keyValue && (
                        <CopyableKey label={keyLabel} value={keyValue} />
                      )}
                      {groupBy === TapBalanceGroupBy.GroupKey &&
                        entry.group_key && (
                          <span className="text-[10px] text-muted-foreground/60">
                            Group
                          </span>
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-lg font-semibold">
                        {priceEntry
                          ? (
                              Number(entry.balance) /
                              10 ** priceEntry.precision
                            ).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : entry.balance || '0'}
                      </span>
                      {usdValue != null && (
                        <span className="text-xs text-muted-foreground">
                          ≈ $
                          {usdValue.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {channelBalances.length > 0 && (
        <>
          <span className="text-sm font-semibold">Channel Balances</span>
          <div className="grid gap-3">
            {channelBalances.map(entry => {
              const priceEntry = priceMap.get(entry.key);
              const usdValue = priceEntry
                ? (entry.balance / 10 ** priceEntry.precision) * priceEntry.usd
                : null;

              const isAmbossListed = supportedKeys.has(entry.key);

              return (
                <Card key={entry.key}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{entry.name}</span>
                          {isAmbossListed && (
                            <Badge variant="outline" className="text-primary">
                              Amboss Listed
                            </Badge>
                          )}
                        </div>
                        <CopyableKey
                          label={
                            groupBy === TapBalanceGroupBy.GroupKey
                              ? 'Group key'
                              : 'Asset ID'
                          }
                          value={entry.key}
                        />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-lg font-semibold">
                          {priceEntry
                            ? (
                                entry.balance /
                                10 ** priceEntry.precision
                              ).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : entry.balance.toString()}
                        </span>
                        {usdValue != null && (
                          <span className="text-xs text-muted-foreground">
                            ≈ $
                            {usdValue.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
