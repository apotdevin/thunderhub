import { FC, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Info, Copy, Check, Star } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { useGetTapAssetChannelBalancesQuery } from '../../graphql/queries/__generated__/getTapAssetChannelBalances.generated';
import { TapBalanceGroupBy } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';
import { formatUsd } from '../../lib/formatUsd';

type PriceInfo = { usd: number; precision: number };

type UnifiedEntry = {
  key: string;
  keyLabel: string;
  names: string[];
  onChainBalance: number;
  channelBalance: number;
  totalBalance: number;
  precision: number;
  priceEntry: PriceInfo | undefined;
  isAmbossListed: boolean;
};

const formatBalance = (atomic: number, precision: number): string =>
  (atomic / 10 ** precision).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
      <span className="text-xs text-muted-foreground font-mono truncate max-w-62.5">
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

type ListingFilter = 'listed' | 'unlisted' | 'all';

export const AssetsList: FC = () => {
  const [listingFilter, setListingFilter] = useState<ListingFilter>('listed');
  const {
    data: balancesData,
    loading: balancesLoading,
    error: balancesError,
  } = useGetTapBalancesQuery({
    variables: { group_by: TapBalanceGroupBy.GroupKey },
    onError: error => toast.error(getErrorContent(error)),
  });

  const { data: supportedData } = useGetTapSupportedAssetsQuery();

  const { data: channelsData, loading: channelsLoading } =
    useGetTapAssetChannelBalancesQuery({
      fetchPolicy: 'cache-and-network',
      onError: error => toast.error(getErrorContent(error)),
    });

  const balances = balancesData?.taproot_assets?.get_balances?.balances || [];
  const channels =
    channelsData?.taproot_assets?.get_asset_channel_balances || [];

  const { priceMap, supportedKeys } = useMemo(() => {
    const priceMap = new Map<string, PriceInfo>();
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
    return { priceMap, supportedKeys };
  }, [supportedData]);

  const unified = useMemo(() => {
    // 1. On-chain balances keyed by group_key (falling back to asset_id)
    const onChainMap = new Map<
      string,
      { names: string[]; balance: number; hasGroupKey: boolean }
    >();
    for (const entry of balances) {
      const key = entry.group_key || entry.asset_id || '';
      if (!key) continue;
      onChainMap.set(key, {
        names: entry.names ? [...entry.names] : [],
        balance: Number(entry.balance) || 0,
        hasGroupKey: !!entry.group_key,
      });
    }

    // 2. Channel balances aggregated by group_key (falling back to asset_id)
    const channelMap = new Map<
      string,
      {
        localBalance: number;
        names: string[];
        hasGroupKey: boolean;
        precision: number;
      }
    >();
    for (const ch of channels) {
      const key = ch.group_key || ch.asset_id;
      const localBal = Number(ch.local_balance) || 0;
      const existing = channelMap.get(key);
      if (existing) {
        existing.localBalance += localBal;
        if (ch.asset_name && !existing.names.includes(ch.asset_name)) {
          existing.names.push(ch.asset_name);
        }
      } else {
        channelMap.set(key, {
          localBalance: localBal,
          names: ch.asset_name ? [ch.asset_name] : [],
          hasGroupKey: !!ch.group_key,
          precision: ch.asset_precision ?? 0,
        });
      }
    }

    // 3. Merge into unified entries
    const allKeys = new Set([...onChainMap.keys(), ...channelMap.keys()]);
    const merged: UnifiedEntry[] = [];

    for (const key of allKeys) {
      const onChain = onChainMap.get(key);
      const channel = channelMap.get(key);
      const onChainBalance = onChain?.balance ?? 0;
      const channelBalance = channel?.localBalance ?? 0;
      const totalBalance = onChainBalance + channelBalance;

      if (totalBalance === 0) continue;

      const names = onChain?.names?.length
        ? onChain.names
        : (channel?.names ?? []);

      const hasGroupKey = onChain?.hasGroupKey || channel?.hasGroupKey;
      const priceEntry = priceMap.get(key);
      const precision = channel?.precision ?? priceEntry?.precision ?? 0;

      merged.push({
        key,
        keyLabel: hasGroupKey ? 'Group key' : 'Asset ID',
        names,
        onChainBalance,
        channelBalance,
        totalBalance,
        precision,
        priceEntry,
        isAmbossListed: supportedKeys.has(key),
      });
    }

    merged.sort((a, b) => {
      if (a.isAmbossListed !== b.isAmbossListed)
        return a.isAmbossListed ? -1 : 1;
      return b.totalBalance - a.totalBalance;
    });

    return merged;
  }, [balances, channels, priceMap, supportedKeys]);

  const filtered = useMemo(() => {
    if (listingFilter === 'all') return unified;
    if (listingFilter === 'listed')
      return unified.filter(e => e.isAmbossListed);
    return unified.filter(e => !e.isAmbossListed);
  }, [unified, listingFilter]);

  if (balancesLoading || channelsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  if (balancesError) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Info className="mr-2" size={16} />
        Unable to load assets. Make sure you are connected via litd.
      </div>
    );
  }

  if (unified.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Info className="mr-2" size={16} />
        No assets found. Mint your first asset to get started.
      </div>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-4">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={listingFilter}
            onValueChange={v => {
              if (v) setListingFilter(v as ListingFilter);
            }}
          >
            <ToggleGroupItem value="listed">Amboss Listed</ToggleGroupItem>
            <ToggleGroupItem value="unlisted">Unlisted</ToggleGroupItem>
            <ToggleGroupItem value="all">All</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Key</TableHead>
              <TableHead className="text-right">On-chain</TableHead>
              <TableHead className="text-right">Channel</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">USD Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(entry => {
              const usdValue = entry.priceEntry
                ? (entry.totalBalance / 10 ** entry.precision) *
                  entry.priceEntry.usd
                : null;

              return (
                <TableRow key={entry.key}>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">
                        {entry.names.length
                          ? entry.names.join(', ')
                          : 'Unknown'}
                      </span>
                      {listingFilter === 'all' && entry.isAmbossListed && (
                        <Star
                          size={14}
                          className="shrink-0 fill-yellow-400 text-yellow-400"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground/60 shrink-0">
                        {entry.keyLabel}
                      </span>
                      <CopyableKey label={entry.keyLabel} value={entry.key} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {entry.onChainBalance > 0
                      ? formatBalance(entry.onChainBalance, entry.precision)
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {entry.channelBalance > 0
                      ? formatBalance(entry.channelBalance, entry.precision)
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatBalance(entry.totalBalance, entry.precision)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {usdValue != null ? `≈ $${formatUsd(usdValue)}` : '—'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
