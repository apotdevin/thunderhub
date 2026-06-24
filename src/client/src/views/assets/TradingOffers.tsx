import { FC, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Loader2,
  Info,
  ArrowUpDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useGetTapOffersQuery } from '../../graphql/queries/__generated__/getTapOffers.generated';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { getErrorContent } from '../../utils/error';
import { cn } from '../../lib/utils';
import {
  TapTransactionType,
  TapOfferSortBy,
  TapOfferSortDir,
} from '../../graphql/types';
import {
  useTradingState,
  useTradingDispatch,
} from '../../context/TradingContext';
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
  const { selectedAsset, selectedOffer } = useTradingState();
  const dispatch = useTradingDispatch();

  const [sortBy, setSortBy] = useState<TapOfferSortBy>(TapOfferSortBy.Rate);
  const [sortDir, setSortDir] = useState<TapOfferSortDir>(TapOfferSortDir.Asc);

  const { data: supportedData } = useGetTapSupportedAssetsQuery({
    onError: err => toast.error(getErrorContent(err)),
  });

  const allSupported =
    supportedData?.rails?.get_tap_supported_assets?.list || [];

  const selectedAssetData = allSupported.find(a => a.id === selectedAsset?.id);
  const selectedSymbol = selectedAssetData?.symbol || '';

  const queryVars = {
    ambossAssetId: selectedAsset?.id,
    sortBy,
    sortDir,
  };

  const {
    data: buyData,
    loading: buyLoading,
    error: buyError,
  } = useGetTapOffersQuery({
    variables: {
      input: { ...queryVars, transactionType: TapTransactionType.Purchase },
    },
    onError: err => toast.error(getErrorContent(err)),
  });

  const {
    data: sellData,
    loading: sellLoading,
    error: sellError,
  } = useGetTapOffersQuery({
    variables: {
      input: { ...queryVars, transactionType: TapTransactionType.Sale },
    },
    onError: err => toast.error(getErrorContent(err)),
  });

  const buyOffers = buyData?.magma?.get_tap_offers?.list || [];
  const sellOffers = sellData?.magma?.get_tap_offers?.list || [];
  const buyTotal = buyData?.magma?.get_tap_offers?.totalCount || 0;
  const sellTotal = sellData?.magma?.get_tap_offers?.totalCount || 0;

  const loading = buyLoading || sellLoading;
  const error = buyError && sellError;

  type TaggedOffer = (typeof buyOffers)[number] & {
    _side: TapTransactionType;
  };

  const allOffers = useMemo<TaggedOffer[]>(() => {
    const byKey = new Map<string, TaggedOffer>();
    for (const o of buyOffers) {
      byKey.set(`${TapTransactionType.Purchase}-${o.id}`, {
        ...o,
        _side: TapTransactionType.Purchase,
      });
    }
    for (const o of sellOffers) {
      byKey.set(`${TapTransactionType.Sale}-${o.id}`, {
        ...o,
        _side: TapTransactionType.Sale,
      });
    }
    const tagged = Array.from(byKey.values());

    tagged.sort((a, b) => {
      let cmp = 0;
      if (sortBy === TapOfferSortBy.Rate) {
        const ra = Number(a.rate.displayAmount || a.rate.fullAmount || 0);
        const rb = Number(b.rate.displayAmount || b.rate.fullAmount || 0);
        cmp = ra - rb;
      } else if (sortBy === TapOfferSortBy.Available) {
        const aa = Number(
          a.available.displayAmount || a.available.fullAmount || 0
        );
        const ab = Number(
          b.available.displayAmount || b.available.fullAmount || 0
        );
        cmp = aa - ab;
      }
      return sortDir === TapOfferSortDir.Asc ? cmp : -cmp;
    });

    return tagged;
  }, [buyOffers, sellOffers, sortBy, sortDir]);

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

  const hasSelectedAsset = !!selectedAsset;

  return (
    <div className="flex flex-col gap-3">
      {/* Loading */}
      {loading && allOffers.length === 0 && (
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
      {!loading && !error && allOffers.length === 0 && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Info className="mr-2" size={16} />
          No offers found. Try adjusting filters or check back later.
        </div>
      )}

      {/* Offers table */}
      {allOffers.length > 0 && (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Side</TableHead>
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
              {allOffers.map(offer => {
                const symbol = selectedSymbol || offer.asset?.symbol || '';
                const isBuy = offer._side === TapTransactionType.Purchase;
                return (
                  <TableRow
                    key={`${offer._side}-${offer.id}`}
                    className={cn(
                      'cursor-pointer',
                      selectedOffer?.id === offer.id && 'bg-primary/5'
                    )}
                    onClick={() => {
                      dispatch({ type: 'setTxType', txType: offer._side });
                      dispatch({ type: 'selectOffer', offer });
                    }}
                  >
                    <TableCell>
                      <span
                        className={cn(
                          'text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded',
                          isBuy
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-red-500/10 text-red-600'
                        )}
                      >
                        {isBuy ? 'Buy' : 'Sell'}
                      </span>
                    </TableCell>
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
          {(buyTotal > buyOffers.length || sellTotal > sellOffers.length) && (
            <div className="text-xs text-muted-foreground text-center py-1.5 border-t border-border/40">
              Showing {allOffers.length} of {buyTotal + sellTotal}
            </div>
          )}
        </div>
      )}
      {/* Liquidity provider CTA */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
        <span>Want to provide liquidity?</span>
        <a
          href="https://amboss.tech/rails"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          Join Amboss Rails
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
};
