import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Info, ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetTapOffersQuery } from '../../graphql/queries/__generated__/getTapOffers.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetTapUniverseAssetsQuery } from '../../graphql/queries/__generated__/getTapUniverseAssets.generated';
import { getErrorContent } from '../../utils/error';
import { cn } from '../../lib/utils';

type TransactionType = 'PURCHASE' | 'SALE';
type SortBy = 'RATE' | 'AVAILABLE';

export const TradingOffers: FC = () => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [txType, setTxType] = useState<TransactionType>('PURCHASE');
  const [sortBy, setSortBy] = useState<SortBy>('RATE');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC');

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { groupBy: 'assetId' },
  });

  const { data: universeData } = useGetTapUniverseAssetsQuery();

  // Merge owned + universe assets for the dropdown
  const seen = new Set<string>();
  const allAssets: { assetId: string; name: string; source: string }[] = [];

  for (const b of balancesData?.getTapBalances?.balances || []) {
    if (b.assetId && !seen.has(b.assetId)) {
      seen.add(b.assetId);
      allAssets.push({
        assetId: b.assetId,
        name: b.name || 'Unknown',
        source: 'owned',
      });
    }
  }

  for (const a of universeData?.getTapUniverseAssets?.assets || []) {
    if (a.assetId && !seen.has(a.assetId)) {
      seen.add(a.assetId);
      allAssets.push({
        assetId: a.assetId,
        name: a.name || 'Unknown',
        source: 'universe',
      });
    }
  }

  const {
    data: offersData,
    loading,
    error,
  } = useGetTapOffersQuery({
    variables: {
      assetId: selectedAsset,
      transactionType: txType,
      sortBy,
      sortDir,
    },
    skip: !selectedAsset,
    onError: err => toast.error(getErrorContent(err)),
  });

  const offers = offersData?.getTapOffers?.list || [];
  const totalCount = offersData?.getTapOffers?.totalCount || 0;

  const toggleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortDir(d => (d === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(field);
      setSortDir('ASC');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">
            Asset
          </label>
          <select
            value={selectedAsset}
            onChange={e => setSelectedAsset(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select an asset...</option>
            {allAssets.map(a => (
              <option key={a.assetId} value={a.assetId}>
                {a.name} ({a.assetId.slice(0, 12)}...)
                {a.source === 'universe' ? ' [universe]' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-1">
          {(['PURCHASE', 'SALE'] as const).map(t => (
            <Button
              key={t}
              variant={txType === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTxType(t)}
              className="text-xs"
            >
              {t === 'PURCHASE' ? 'Buy' : 'Sell'}
            </Button>
          ))}
        </div>
      </div>

      {!selectedAsset && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Info className="mr-2" size={16} />
          Select an asset to see available offers
        </div>
      )}

      {selectedAsset && loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-muted-foreground" size={20} />
        </div>
      )}

      {selectedAsset && error && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Info className="mr-2" size={16} />
          Unable to load offers
        </div>
      )}

      {selectedAsset && !loading && !error && offers.length === 0 && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Info className="mr-2" size={16} />
          No offers available for this asset
        </div>
      )}

      {offers.length > 0 && (
        <>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {totalCount} offer{totalCount !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              {(['RATE', 'AVAILABLE'] as const).map(field => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={cn(
                    'flex items-center gap-1 transition-colors',
                    sortBy === field
                      ? 'text-foreground'
                      : 'hover:text-foreground'
                  )}
                >
                  <ArrowUpDown size={12} />
                  {field === 'RATE' ? 'Rate' : 'Available'}
                  {sortBy === field && (sortDir === 'ASC' ? ' ↑' : ' ↓')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            {offers.map(offer => (
              <Card key={offer.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-sm">
                        {offer.node.alias || 'Unknown'}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                        {offer.node.pubkey}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-sm">
                        <span className="text-muted-foreground text-xs mr-1">
                          Rate:
                        </span>
                        <span className="font-semibold">
                          {offer.rate.displayAmount || offer.rate.fullAmount}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Available:{' '}
                        {offer.available.displayAmount ||
                          offer.available.fullAmount}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
