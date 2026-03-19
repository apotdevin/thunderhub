import { Fragment } from 'react';
import {
  Trash,
  ChevronRight,
  Clock,
  Check,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getAddressLink } from '../../components/generic/helpers';
import { useSwapExpire } from './SwapExpire';
import {
  useBoltzSwaps,
  useBoltzSwapActions,
  SwapEntry,
} from '../../context/BoltzSwapContext';

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

const ReadyRow = ({ swap }: { swap: SwapEntry }) => {
  const actions = useBoltzSwapActions();
  const time = useSwapExpire(swap.decodedInvoice?.expires_at);

  return (
    <button className={clickableRow} onClick={() => actions.openSwap(swap.id)}>
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

const SwapRow = ({ swap }: { swap: SwapEntry }) => {
  const actions = useBoltzSwapActions();
  const status = swap.liveStatus?.status;

  if (!swap?.id) return null;

  if (!status) {
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

  switch (status) {
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
      return <ReadyRow swap={swap} />;
    case MEMPOOL:
      return (
        <button
          className={clickableRow}
          onClick={() => actions.openClaim(swap.id, MEMPOOL)}
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
          onClick={() => actions.openClaim(swap.id, CONFIRMED)}
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
          onClick={() => actions.openClaim(swap.id, CONFIRMED)}
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
            <StatusBadge variant="warning">{status}</StatusBadge>
          </div>
        </div>
      );
  }
};

export const SwapStatus = () => {
  const { swaps } = useBoltzSwaps();
  const actions = useBoltzSwapActions();

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
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => actions.cleanup()}
                >
                  <Trash size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Cleanup expired, refunded and completed swaps.
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <Card>
          <CardContent>
            {!swaps.length && (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No swaps yet. Create one above to get started.
              </p>
            )}

            {swaps.length > 0 && (
              <div className="divide-y divide-border">
                {swaps.map(swap => (
                  <Fragment key={swap.id}>
                    <SwapRow swap={swap} />
                  </Fragment>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
