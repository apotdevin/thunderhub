import toast from 'react-hot-toast';
import { useDecodeRequestQuery } from '../../../../graphql/queries/__generated__/decodeRequest.generated';
import { getErrorContent } from '../../../../utils/error';
import { Price } from '../../../../components/price/Price';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { formatDistanceToNowStrict, format } from 'date-fns';
import { shorten } from '../../../../components/generic/helpers';
import { config } from '../../../../config/thunderhubConfig';

interface DecodedProps {
  request: string;
  setShow: (show: boolean) => void;
}

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 py-1.5 text-xs">
    <span className="shrink-0 text-muted-foreground">{label}</span>
    <span className="text-right font-medium break-all">{children}</span>
  </div>
);

export const Decoded = ({ request, setShow }: DecodedProps) => {
  const { data, loading } = useDecodeRequestQuery({
    fetchPolicy: 'network-only',
    variables: { request },
    onError: error => {
      setShow(false);
      toast.error(getErrorContent(error));
    },
  });

  if (loading || !data || !data.decodeRequest) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  const {
    chain_address,
    cltv_delta,
    description,
    description_hash,
    destination,
    expires_at,
    id,
    tokens,
    destination_node,
  } = data.decodeRequest;

  const alias = destination_node?.node?.alias || 'Unknown';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="divide-y divide-border">
        {id && (
          <Row label="Id">
            <span className="font-mono text-[11px]">{shorten(id)}</span>
            <button
              onClick={() => copyToClipboard(id)}
              className="ml-1.5 inline-flex align-middle text-muted-foreground hover:text-foreground"
            >
              <Copy size={10} />
            </button>
          </Row>
        )}
        {destination && (
          <Row label="Destination">
            {!config.disableLinks ? (
              <a
                href={`https://amboss.space/node/${destination}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {alias}
                <ExternalLink size={10} className="ml-1 inline align-middle" />
              </a>
            ) : (
              alias
            )}
            <button
              onClick={() => copyToClipboard(destination)}
              className="ml-1.5 inline-flex align-middle text-muted-foreground hover:text-foreground"
            >
              <Copy size={10} />
            </button>
          </Row>
        )}
        {description && <Row label="Description">{description}</Row>}
        {description_hash && (
          <Row label="Description Hash">
            <span className="font-mono text-[11px]">
              {shorten(description_hash)}
            </span>
          </Row>
        )}
        {chain_address && (
          <Row label="Chain Address">
            <span className="font-mono text-[11px]">
              {shorten(chain_address)}
            </span>
          </Row>
        )}
        {cltv_delta && <Row label="CLTV Delta">{cltv_delta}</Row>}
        {expires_at && (
          <Row label="Expires">
            {formatDistanceToNowStrict(new Date(expires_at))}
            <span className="ml-1 text-muted-foreground">
              ({format(new Date(expires_at), 'MMM d, yyyy H:mm')})
            </span>
          </Row>
        )}
        {tokens && (
          <Row label="Amount">
            <Price amount={tokens} />
          </Row>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-2 w-full"
        onClick={() => setShow(false)}
      >
        <ArrowLeft size={14} />
        Decode Another
      </Button>
    </div>
  );
};
