import { ExternalLink } from 'lucide-react';
import {
  useGetPendingMagmaOrdersQuery,
  GetPendingMagmaOrdersQuery,
} from '../../../graphql/queries/__generated__/getPendingMagmaOrders.generated';
import { Price } from '../../../components/price/Price';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';

type PendingOrder = NonNullable<
  NonNullable<
    GetPendingMagmaOrdersQuery['getPendingMagmaOrders']
  >['purchases'][number]
>;

const STATUS_LABELS: Record<string, string> = {
  WAITING_FOR_SELLER_APPROVAL: 'Awaiting seller approval',
  WAITING_FOR_BUYER_PAYMENT: 'Payment required',
  WAITING_FOR_CHANNEL_OPEN: 'Awaiting channel open',
  SELLER_SENT_TRANSACTION: 'Transaction broadcast',
  WAITING_FOR_ON_CHAIN_CONFIRMATION: 'Awaiting confirmation',
  VALID_CHANNEL_OPENING: 'Channel opened',
  SELLER_OPENED_CHANNEL: 'Channel confirmed',
  CHANNEL_MONITORING_FINISHED: 'Complete',
  SELLER_REJECTED: 'Seller rejected',
  BUYER_REJECTED: 'Buyer cancelled',
  SELLER_FAILED_TO_REACT: 'Seller timed out',
  BUYER_FAILED_TO_PAY: 'Payment timed out',
  SELLER_FAILED_TO_OPEN_CHANNEL: 'Channel open failed',
  INVALID_CHANNEL_OPENING: 'Invalid channel',
  ADMIN_CLOSED: 'Closed by admin',
};

const STATUS_VARIANTS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  WAITING_FOR_BUYER_PAYMENT: 'default',
  WAITING_FOR_SELLER_APPROVAL: 'secondary',
  WAITING_FOR_CHANNEL_OPEN: 'secondary',
};

function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

function statusVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  return STATUS_VARIANTS[status] ?? 'outline';
}

function peerName(
  party: { pubkey?: string | null; alias?: string | null } | null | undefined
): string {
  if (!party) return 'Unknown';
  return (
    party.alias || (party.pubkey ? party.pubkey.slice(0, 16) + '…' : 'Unknown')
  );
}

function OrderTable({
  orders,
  role,
}: {
  orders: PendingOrder[];
  role: 'buyer' | 'seller';
}) {
  if (!orders.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">
        {role === 'buyer'
          ? 'Purchases (you are buying)'
          : 'Sales (you are selling)'}
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Peer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => {
            const peer =
              role === 'buyer'
                ? peerName(order.source)
                : peerName(order.destination);
            const feeSats =
              role === 'buyer'
                ? order.fees?.buyer?.sats
                : order.fees?.seller?.sats;
            const created = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : '-';

            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{peer}</TableCell>
                <TableCell>
                  <Price amount={order.amount?.sats} />
                </TableCell>
                <TableCell>
                  {feeSats != null ? <Price amount={feeSats} /> : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(order.status)}>
                    {statusLabel(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {created}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href="https://amboss.space/magma"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-1 size-3.5" />
                      {order.status === 'WAITING_FOR_BUYER_PAYMENT'
                        ? 'Pay on Amboss'
                        : 'View on Amboss'}
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export const MagmaOrders = () => {
  const { data } = useGetPendingMagmaOrdersQuery();

  const orders = data?.getPendingMagmaOrders;
  if (!orders) return null;

  const purchases = orders.purchases ?? [];
  const sales = orders.sales ?? [];

  if (!purchases.length && !sales.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Pending Magma Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <OrderTable orders={purchases} role="buyer" />
        <OrderTable orders={sales} role="seller" />
      </CardContent>
    </Card>
  );
};
