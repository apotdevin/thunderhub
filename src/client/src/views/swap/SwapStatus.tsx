import { Fragment, useEffect, useState } from 'react';
import {
  RefreshCw,
  Trash,
  ChevronRight,
  Clock,
  Check,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getAddressLink } from '../../components/generic/helpers';
import Modal from '../../components/modal/ReactModal';
import { useGetBoltzSwapStatusQuery } from '../../graphql/queries/__generated__/getBoltzSwapStatus.generated';
import { SwapClaim } from './SwapClaim';
import { useSwapsDispatch, useSwapsState } from './SwapContext';
import { useSwapExpire } from './SwapExpire';
import { SwapQuote } from './SwapQuote';
import { EnrichedSwap } from './types';

const CREATED = 'swap.created';
export const MEMPOOL = 'transaction.mempool';
const CONFIRMED = 'transaction.confirmed';
const SETTLED = 'invoice.settled';
const EXPIRED = 'swap.expired';
const INVOICE_EXPIRED = 'invoice.expired';
const REFUNDED = 'transaction.refunded';

const StatusBadge = ({
  variant,
  icon: Icon,
  children,
}: {
  variant: 'success' | 'warning' | 'error' | 'default';
  icon?: React.ElementType;
  children: React.ReactNode;
}) => {
  const styles = {
    success:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    default: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

const rowBase = 'flex w-full text-left items-center gap-3 py-3';
const rowContent =
  'flex flex-col items-start gap-1 min-w-0 flex-1 md:flex-row md:items-center md:justify-between';
const clickableRow = `${rowBase} cursor-pointer rounded-md -mx-2 px-2 transition-colors hover:bg-muted/50`;

const RowAction = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1 shrink-0 text-xs text-muted-foreground">
    <span>{label}</span>
    <ChevronRight size={14} />
  </div>
);

const SwapRow = ({ swap, index }: { swap: EnrichedSwap; index: number }) => {
  const dispatch = useSwapsDispatch();

  const ReadyComponent = () => {
    const time = useSwapExpire(swap.decodedInvoice?.expires_at);
    return (
      <button
        className={clickableRow}
        onClick={() => dispatch({ type: 'open', open: index })}
      >
        <div className={rowContent}>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-medium font-mono truncate">
              {swap.id}
            </span>
            {time && (
              <span className="text-[10px] text-muted-foreground">{time}</span>
            )}
          </div>
          <StatusBadge variant="success" icon={Clock}>
            Ready to Pay
          </StatusBadge>
        </div>
        <RowAction label="Pay" />
      </button>
    );
  };

  if (!swap?.id) return null;

  if (!swap.boltz?.status) {
    return (
      <div className={rowBase}>
        <div className={rowContent}>
          <span className="text-xs font-medium font-mono truncate">
            {swap.id}
          </span>
          <StatusBadge variant="error" icon={AlertTriangle}>
            Unable to get status
          </StatusBadge>
        </div>
      </div>
    );
  }

  switch (swap.boltz.status) {
    case INVOICE_EXPIRED:
    case EXPIRED:
      return (
        <div className={rowBase}>
          <div className={rowContent}>
            <span className="text-xs font-medium font-mono truncate">
              {swap.id}
            </span>
            <StatusBadge variant="error" icon={XCircle}>
              Expired
            </StatusBadge>
          </div>
        </div>
      );
    case REFUNDED:
      return (
        <div className={rowBase}>
          <div className={rowContent}>
            <span className="text-xs font-medium font-mono truncate">
              {swap.id}
            </span>
            <StatusBadge variant="warning" icon={AlertTriangle}>
              Refunded
            </StatusBadge>
          </div>
        </div>
      );
    case CREATED:
      return <ReadyComponent />;
    case MEMPOOL:
      return (
        <button
          className={clickableRow}
          onClick={() =>
            dispatch({ type: 'claim', claim: index, claimType: MEMPOOL })
          }
        >
          <div className={rowContent}>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-medium font-mono truncate">
                {swap.id}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {getAddressLink(swap.receivingAddress)}
              </span>
            </div>
            <StatusBadge variant="warning" icon={Clock}>
              In Mempool
            </StatusBadge>
          </div>
          <RowAction label="Claim" />
        </button>
      );
    case CONFIRMED:
      return (
        <button
          className={clickableRow}
          onClick={() =>
            dispatch({ type: 'claim', claim: index, claimType: CONFIRMED })
          }
        >
          <div className={rowContent}>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-medium font-mono truncate">
                {swap.id}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {getAddressLink(swap.receivingAddress)}
              </span>
            </div>
            <StatusBadge variant="success" icon={Check}>
              Ready to Claim
            </StatusBadge>
          </div>
          <RowAction label="Claim" />
        </button>
      );
    case SETTLED:
      return (
        <button
          className={clickableRow}
          onClick={() =>
            dispatch({ type: 'claim', claim: index, claimType: CONFIRMED })
          }
        >
          <div className={rowContent}>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-medium font-mono truncate">
                {swap.id}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {getAddressLink(swap.receivingAddress)}
              </span>
            </div>
            <StatusBadge variant="default" icon={Check}>
              Completed
            </StatusBadge>
          </div>
          <RowAction label="Claim" />
        </button>
      );
    default:
      return (
        <div className={rowBase}>
          <div className={rowContent}>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-medium font-mono truncate">
                {swap.id}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {getAddressLink(swap.receivingAddress)}
              </span>
            </div>
            <StatusBadge variant="warning">{swap.boltz.status}</StatusBadge>
          </div>
        </div>
      );
  }
};

export const SwapStatus = () => {
  const { swaps, open, claim } = useSwapsState();
  const dispatch = useSwapsDispatch();

  const [enriched, setEnriched] = useState<EnrichedSwap[]>([]);

  const { data, refetch, networkStatus } = useGetBoltzSwapStatusQuery({
    notifyOnNetworkStatusChange: true,
    variables: { ids: swaps.map((s: { id: string }) => s.id).filter(Boolean) },
    fetchPolicy: 'network-only',
    skip: !swaps.length,
  });

  const loading = [1, 2, 3, 4, 6].includes(networkStatus);

  useEffect(() => {
    if (loading || !data?.getBoltzSwapStatus) return;

    const swapsWithState: EnrichedSwap[] = swaps.map(swap => {
      const status = data.getBoltzSwapStatus.find(s => s?.id === swap.id);
      const enriched = { ...swap, boltz: status?.boltz };
      return enriched;
    });

    setEnriched(swapsWithState);
  }, [data, loading, swaps]);

  const handleCleanup = () => {
    const cleaned = enriched.filter(s => {
      if (!s.boltz?.status) return true;
      const status = s.boltz.status;
      if (
        status === SETTLED ||
        status === REFUNDED ||
        status === EXPIRED ||
        status === INVOICE_EXPIRED
      ) {
        return false;
      }
      return true;
    });

    dispatch({ type: 'cleanup', swaps: cleaned });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            Swap History
            {swaps.length > 0 && (
              <Badge variant="secondary" className="min-w-5 justify-center">
                {swaps.length}
              </Badge>
            )}
          </h2>
          {swaps.length > 0 && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={loading}
                onClick={() => refetch()}
              >
                <RefreshCw
                  size={14}
                  className={loading ? 'animate-spin' : ''}
                />
              </Button>
              <div data-tip data-for={`cleanup`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={loading}
                  onClick={handleCleanup}
                >
                  <Trash size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>

        <Card>
          <CardContent>
            {loading && (
              <p className="text-xs text-muted-foreground py-4 text-center">
                Loading swap statuses...
              </p>
            )}

            {!loading && (!swaps.length || !data?.getBoltzSwapStatus) && (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No swaps yet. Create one above to get started.
              </p>
            )}

            {!loading && enriched.length > 0 && (
              <div className="divide-y divide-border">
                {enriched.map((swap, index) => (
                  <Fragment key={`${swap?.id}-${index}`}>
                    <SwapRow swap={swap} index={index} />
                  </Fragment>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ReactTooltip id={`cleanup`}>
        Cleanup expired, refunded and completed swaps.
      </ReactTooltip>

      <Modal
        isOpen={typeof open === 'number' || typeof claim === 'number'}
        closeCallback={() => dispatch({ type: 'close' })}
      >
        {typeof open === 'number' ? <SwapQuote /> : <SwapClaim />}
      </Modal>
    </>
  );
};
