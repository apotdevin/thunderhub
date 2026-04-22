import { FC } from 'react';
import { InvoiceType } from '../../graphql/types';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useGetChannelQuery } from '../../graphql/queries/__generated__/getChannel.generated';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Price } from '../../components/price/Price';
import {
  getDateDif,
  getPastFutureStr,
  getFormatDate,
} from '../../components/generic/helpers';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DetailTable, DetailRow } from './DetailTable';

interface InvoiceCardProps {
  invoice: InvoiceType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

const ChannelAlias: FC<{ id: string }> = ({ id }) => {
  const { data, loading, error } = useGetChannelQuery({
    variables: { id },
  });

  if (loading) return <LoadingCard noCard={true} />;
  if (error) return <span className="text-muted-foreground">Unknown</span>;

  const alias =
    data?.getChannel.partner_node_policies?.node?.node?.alias || 'Unknown';

  return <span>{alias}</span>;
};

const StatusBadge = ({
  confirmed,
  canceled,
}: {
  confirmed: boolean;
  canceled?: boolean | null;
}) => {
  if (confirmed) {
    return (
      <Badge
        variant="secondary"
        className="w-17.5 justify-center text-[10px] rounded-sm bg-green-500/10 text-green-600 dark:text-green-400"
      >
        Paid
      </Badge>
    );
  }
  if (canceled) {
    return (
      <Badge
        variant="destructive"
        className="w-17.5 justify-center text-[10px] rounded-sm"
      >
        Canceled
      </Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className="w-17.5 justify-center text-[10px] rounded-sm"
    >
      Pending
    </Badge>
  );
};

export const InvoiceCard = ({
  invoice,
  index,
  setIndexOpen,
  indexOpen,
}: InvoiceCardProps) => {
  const {
    chain_address,
    confirmed_at,
    created_at,
    description,
    description_hash,
    expires_at,
    id,
    is_canceled,
    is_confirmed,
    is_held,
    is_private,
    request,
    secret,
    tokens,
    date,
    payments,
  } = invoice;

  const texts = payments.map(p => p?.messages?.message).filter(Boolean);
  const hasMessages = !!texts.length;
  const isOpen = index === indexOpen;

  const handleClick = () => {
    setIndexOpen(isOpen ? 0 : index);
  };

  return (
    <div className="rounded border border-border bg-card/50 hover:bg-card transition-colors">
      <button
        onClick={handleClick}
        className="w-full text-left px-3 py-2.5 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <StatusBadge confirmed={is_confirmed} canceled={is_canceled} />
          </div>
          <div className="hidden sm:flex flex-1 min-w-0 items-center gap-2">
            <span className="font-medium text-sm truncate">
              {description || 'Invoice'}
            </span>
            {hasMessages && (
              <MessageCircle size={14} className="text-primary shrink-0" />
            )}
          </div>
          <span className="hidden sm:block text-xs text-muted-foreground shrink-0">
            {getDateDif(date)} ago
          </span>
          <span className="font-mono text-sm font-medium shrink-0 ml-auto sm:ml-0">
            <Price amount={tokens} />
          </span>
          {isOpen ? (
            <ChevronUp size={14} className="text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown size={14} className="text-muted-foreground shrink-0" />
          )}
        </div>
        <div className="flex sm:hidden items-center gap-2 mt-1.5">
          <span className="text-xs truncate text-muted-foreground">
            {description || 'Invoice'}
          </span>
          {hasMessages && (
            <MessageCircle size={12} className="text-primary shrink-0" />
          )}
          <span className="text-[11px] text-muted-foreground shrink-0 ml-auto">
            {getDateDif(date)} ago
          </span>
        </div>
      </button>
      {isOpen && (
        <div className="px-3 pb-3">
          <Separator className="mb-3" />
          {payments.length > 0 && (
            <div className="mb-3 space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Payments
              </div>
              {payments.map((p, idx) => (
                <div key={idx} className="rounded bg-muted/50 p-2">
                  <DetailTable>
                    <DetailRow label="Amount">
                      <Price amount={p.tokens} />
                    </DetailRow>
                    <DetailRow label="Channel">{p.in_channel}</DetailRow>
                    <DetailRow label="Peer">
                      <ChannelAlias id={p.in_channel} />
                    </DetailRow>
                    {p.messages?.message && (
                      <DetailRow label="Message">
                        {p.messages.message}
                      </DetailRow>
                    )}
                  </DetailTable>
                </div>
              ))}
            </div>
          )}
          <DetailTable>
            {is_confirmed && confirmed_at && (
              <DetailRow label="Confirmed">
                {`${getDateDif(confirmed_at)} ago (${getFormatDate(confirmed_at)})`}
              </DetailRow>
            )}
            <DetailRow label="Created">
              {`${getDateDif(created_at)} ago (${getFormatDate(created_at)})`}
            </DetailRow>
            <DetailRow label="Expires">
              {`${getDateDif(expires_at)} ${getPastFutureStr(expires_at)} (${getFormatDate(expires_at)})`}
            </DetailRow>
            <DetailRow label="ID">{id}</DetailRow>
            {chain_address && (
              <DetailRow label="Chain Address">{chain_address}</DetailRow>
            )}
            {description_hash && (
              <DetailRow label="Description Hash">{description_hash}</DetailRow>
            )}
            <DetailRow label="Canceled">{is_canceled ? 'Yes' : 'No'}</DetailRow>
            <DetailRow label="Held">{is_held ? 'Yes' : 'No'}</DetailRow>
            <DetailRow label="Private">{is_private ? 'Yes' : 'No'}</DetailRow>
            {secret && <DetailRow label="Secret">{secret}</DetailRow>}
            {request && <DetailRow label="Request">{request}</DetailRow>}
          </DetailTable>
        </div>
      )}
    </div>
  );
};
