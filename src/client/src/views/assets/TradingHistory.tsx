import { FC } from 'react';
import { useQuery } from '@apollo/client';
import toast from 'react-hot-toast';
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GET_TRADE_INVOICES } from '../../graphql/queries/getTradeInvoices';
import { useTradingState } from '../../context/TradingContext';
import { getErrorContent } from '../../utils/error';
import { formatNumber } from '../../utils/helpers';

type TradeInvoice = {
  id: string;
  direction: string;
  group_key?: string | null;
  asset_id?: string | null;
  asset_amount: string;
  asset_symbol?: string | null;
  asset_precision?: number | null;
  sats: string;
  is_confirmed: boolean;
  is_canceled?: boolean | null;
  created_at: string;
  confirmed_at?: string | null;
};

const formatAssetAmount = (atomic: string, precision: number) => {
  if (precision > 0) {
    const val = Number(atomic) / 10 ** precision;
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: precision,
    });
  }
  return formatNumber(atomic);
};

export const TradingHistory: FC = () => {
  const { selectedAsset } = useTradingState();

  const { data, loading } = useQuery(GET_TRADE_INVOICES, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30_000,
    onError: err => toast.error(getErrorContent(err)),
  });

  const allInvoices: TradeInvoice[] =
    data?.trade?.trade_invoices?.invoices ?? [];

  const invoices = selectedAsset
    ? allInvoices.filter(
        inv =>
          (selectedAsset.groupKey &&
            inv.group_key === selectedAsset.groupKey) ||
          (selectedAsset.assetId && inv.asset_id === selectedAsset.assetId)
      )
    : allInvoices;

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={16} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Clock size={20} className="text-muted-foreground/30 mb-2" />
        <p className="text-xs text-muted-foreground">
          {selectedAsset ? 'No trades for this asset yet' : 'No trades yet'}
        </p>
      </div>
    );
  }

  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
          <th className="text-left font-medium pb-1.5 pl-1">Type</th>
          <th className="text-left font-medium pb-1.5">Pair</th>
          <th className="text-right font-medium pb-1.5">Amount</th>
          <th className="text-right font-medium pb-1.5">Sats</th>
          <th className="text-right font-medium pb-1.5">Rate</th>
          <th className="text-right font-medium pb-1.5">Date</th>
          <th className="text-center font-medium pb-1.5 pr-1">Status</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map(inv => {
          // buy = send BTC, receive asset → "Buy {asset}"
          // sell = send asset, receive BTC → "Sell {asset}"
          const isBuyAsset = inv.direction === 'buy';
          const isPending = !inv.is_confirmed && !inv.is_canceled;
          const date = inv.confirmed_at || inv.created_at;
          const precision =
            inv.asset_precision ?? selectedAsset?.precision ?? 0;
          const symbol = inv.asset_symbol || selectedAsset?.symbol || '';

          return (
            <tr
              key={inv.id}
              className="border-t border-border/30 hover:bg-muted/20 transition-colors"
            >
              <td className="py-1.5 pl-1">
                <span
                  className={cn(
                    'font-medium whitespace-nowrap',
                    inv.is_canceled
                      ? 'text-muted-foreground/40 line-through'
                      : isBuyAsset
                        ? 'text-green-500'
                        : 'text-red-500'
                  )}
                >
                  {isBuyAsset
                    ? `Buy ${symbol || 'Asset'}`
                    : `Sell ${symbol || 'Asset'}`}
                </span>
              </td>
              <td className="py-1.5 whitespace-nowrap text-muted-foreground">
                {isBuyAsset
                  ? `BTC → ${symbol || 'Asset'}`
                  : `${symbol || 'Asset'} → BTC`}
              </td>
              <td className="py-1.5 text-right tabular-nums">
                {formatAssetAmount(inv.asset_amount, precision)}
                {symbol ? (
                  <span className="text-muted-foreground ml-1">{symbol}</span>
                ) : null}
              </td>
              <td className="py-1.5 text-right tabular-nums">
                {formatNumber(inv.sats)}
              </td>
              <td className="py-1.5 text-right tabular-nums text-muted-foreground">
                {Number(inv.asset_amount) > 0 && Number(inv.sats) > 0
                  ? formatNumber(
                      (
                        Number(inv.asset_amount) /
                        10 ** precision /
                        (Number(inv.sats) / 1e8)
                      ).toFixed(2)
                    )
                  : '—'}
              </td>
              <td className="py-1.5 text-right text-muted-foreground">
                {new Date(date).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="py-1.5 pr-1">
                <div className="flex justify-center">
                  {inv.is_canceled ? (
                    <XCircle size={12} className="text-muted-foreground/40" />
                  ) : isPending ? (
                    <Clock size={12} className="text-yellow-500" />
                  ) : (
                    <CheckCircle2 size={12} className="text-green-500" />
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
