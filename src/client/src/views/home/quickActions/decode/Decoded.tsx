import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { Price } from '../../../../components/price/Price';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import { formatDistanceToNowStrict, format } from 'date-fns';
import { shorten } from '../../../../components/generic/helpers';
import { config } from '../../../../config/thunderhubConfig';
import { decode, Section } from 'light-bolt11-decoder';

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

const getSectionValue = (sections: Section[], name: string) => {
  const section = sections.find(s => s.name === name);
  if (section && 'value' in section) return section.value;
  return null;
};

export const Decoded = ({ request, setShow }: DecodedProps) => {
  const decoded = useMemo(() => {
    try {
      return decode(request);
    } catch {
      toast.error('Error decoding invoice');
      setShow(false);
      return null;
    }
  }, [request, setShow]);

  if (!decoded) return null;

  const { sections, expiry } = decoded;
  const description = getSectionValue(sections, 'description') as string | null;
  const descriptionHash = getSectionValue(sections, 'description_hash') as
    | string
    | null;
  const paymentHash = getSectionValue(sections, 'payment_hash') as
    | string
    | null;
  const timestamp = getSectionValue(sections, 'timestamp') as number | null;
  const amountStr = getSectionValue(sections, 'amount') as string | null;
  const tokens = amountStr ? Math.floor(Number(amountStr) / 1000) : null;
  const cltvDelta = getSectionValue(sections, 'min_final_cltv_expiry') as
    | number
    | null;

  // Payee pubkey — tag 19, not in the TS type definition but decoded at runtime
  const destination = getSectionValue(sections, 'payee') as string | null;

  // Calculate expiry date from timestamp + expiry
  const expiresAt =
    timestamp && expiry ? new Date((timestamp + expiry) * 1000) : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="divide-y divide-border">
        {paymentHash && (
          <Row label="Id">
            <span className="font-mono text-[11px]">
              {shorten(paymentHash)}
            </span>
            <button
              onClick={() => copyToClipboard(paymentHash)}
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
                {shorten(destination)}
                <ExternalLink size={10} className="ml-1 inline align-middle" />
              </a>
            ) : (
              shorten(destination)
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
        {descriptionHash && (
          <Row label="Description Hash">
            <span className="font-mono text-[11px]">
              {shorten(String(descriptionHash))}
            </span>
          </Row>
        )}
        {cltvDelta && <Row label="CLTV Delta">{cltvDelta}</Row>}
        {expiresAt && (
          <Row label="Expires">
            {formatDistanceToNowStrict(expiresAt)}
            <span className="ml-1 text-muted-foreground">
              ({format(expiresAt, 'MMM d, yyyy H:mm')})
            </span>
          </Row>
        )}
        {tokens !== null && (
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
