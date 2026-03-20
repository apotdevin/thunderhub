import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Info, ArrowUpDown } from 'lucide-react';
import { useGetTapOffersQuery } from '../../graphql/queries/__generated__/getTapOffers.generated';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { getErrorContent } from '../../utils/error';
import { cn } from '../../lib/utils';

type TransactionType = 'PURCHASE' | 'SALE';
type SortBy = 'RATE' | 'AVAILABLE';

export const TradingOffers: FC = () => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [txType, setTxType] = useState<TransactionType>('PURCHASE');
  const [sortBy, setSortBy] = useState<SortBy>('RATE');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC');

  const { data: supportedData, loading: assetsLoading } =
    useGetTapSupportedAssetsQuery({
      onError: err => toast.error(getErrorContent(err)),
    });

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { groupBy: 'groupKey' },
  });

  const allSupported = supportedData?.getTapSupportedAssets?.list || [];
  const ownedGroupKeys = new Set(
    (balancesData?.getTapBalances?.balances || [])
      .filter(b => b.groupKey)
      .map(b => b.groupKey!)
  );

  // For SALE, only show assets the node owns (match by group key)
  const supportedAssets =
    txType === 'SALE'
      ? allSupported.filter(a => a.groupKey && ownedGroupKeys.has(a.groupKey))
      : allSupported;

  const selectedSymbol =
    supportedAssets.find(a => (a.assetId || a.id) === selectedAsset)?.symbol ||
    '';

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

  const SortIcon: FC<{ field: SortBy }> = ({ field }) => (
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
      {/* Buy / Sell toggle + Asset pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex rounded-md overflow-hidden border border-border">
          {(['PURCHASE', 'SALE'] as const).map(t => (
            <button
              key={t}
              onClick={() => {
                setTxType(t);
                // Clear selection if switching to Sell and current asset isn't owned
                if (t === 'SALE' && selectedAsset) {
                  const selected = allSupported.find(
                    a => (a.assetId || a.id) === selectedAsset
                  );
                  if (
                    !selected?.groupKey ||
                    !ownedGroupKeys.has(selected.groupKey)
                  ) {
                    setSelectedAsset('');
                  }
                }
              }}
              className={cn(
                'px-4 py-1.5 text-sm font-medium transition-colors',
                txType === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {t === 'PURCHASE' ? 'Buy' : 'Sell'}
            </button>
          ))}
        </div>

        <div className="flex gap-1 ml-2">
          {assetsLoading ? (
            <Loader2 className="animate-spin text-muted-foreground" size={16} />
          ) : (
            supportedAssets.map(a => {
              const value = a.assetId || a.id;
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

      {/* Trade amount input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="P2P Trade amount"
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
      {selectedAsset && !loading && !error && offers.length === 0 && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Info className="mr-2" size={16} />
          No offers available
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
                  onClick={() => toggleSort('RATE')}
                >
                  {selectedSymbol ? `${selectedSymbol}/BTC` : 'Rate'}
                  <SortIcon field="RATE" />
                </th>
                <th
                  className="text-left py-3 px-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort('AVAILABLE')}
                >
                  Available
                  <SortIcon field="AVAILABLE" />
                </th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr
                  key={offer.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-3 font-mono text-xs">
                    {offer.node.alias || offer.node.pubkey?.slice(0, 16)}
                  </td>
                  <td className="py-3 px-3">
                    {offer.rate.displayAmount || offer.rate.fullAmount}
                  </td>
                  <td className="py-3 px-3">
                    {offer.available.displayAmount ||
                      offer.available.fullAmount}
                    {selectedSymbol && (
                      <span className="text-muted-foreground ml-1">
                        {selectedSymbol}
                      </span>
                    )}
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
    </div>
  );
};
