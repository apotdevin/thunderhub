import { FC, useState } from 'react';
import { PayRequest } from '../../../../graphql/types';
import { Input } from '@/components/ui/input';
import { Price } from '../../../../components/price/Price';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { usePayLnUrlMutation } from '../../../../graphql/mutations/__generated__/lnUrl.generated';
import { Link } from '../../../../components/link/Link';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../../../utils/error';

type LnPayProps = {
  request: PayRequest;
  defaultAmount?: number;
  title?: string;
};

export const LnPay: FC<LnPayProps> = ({ request, defaultAmount, title }) => {
  const { minSendable, maxSendable, callback, commentAllowed } = request;

  const min = Number(minSendable) / 1000 || 0;
  const max = Number(maxSendable) / 1000 || 0;

  const isSame = min === max;

  const initial = isSame ? min : (defaultAmount ?? min);
  const [amount, setAmount] = useState<number>(initial);
  const [comment, setComment] = useState('');

  const [payLnUrl, { data, loading }] = usePayLnUrlMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!callback) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Missing information from LN Service
      </div>
    );
  }

  const callbackUrl = new URL(callback);

  if (!loading && data?.lnUrlPay.tag) {
    const { tag, url, description, message, ciphertext, iv } = data.lnUrlPay;

    return (
      <div className="flex flex-col items-center gap-3 py-2">
        <CheckCircle size={32} className="text-green-500" />
        <span className="text-sm font-medium">Payment Successful</span>

        {tag === 'url' && (
          <>
            {description && (
              <p className="text-center text-xs text-muted-foreground">
                {description}
              </p>
            )}
            {url && (
              <Link href={url}>
                <span className="text-sm text-primary hover:underline">
                  {url}
                </span>
              </Link>
            )}
          </>
        )}
        {tag === 'message' && message && (
          <p className="text-center text-xs text-muted-foreground">{message}</p>
        )}
        {tag === 'aes' && (
          <div className="w-full space-y-1 text-xs">
            {description && (
              <p className="text-center text-muted-foreground">{description}</p>
            )}
            {ciphertext && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ciphertext</span>
                <span className="break-all font-mono">{ciphertext}</span>
              </div>
            )}
            {iv && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">IV</span>
                <span className="font-mono">{iv}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {title && <span className="text-sm font-medium">{title}</span>}

      {!title && (
        <span className="text-sm text-muted-foreground">
          Pay to {callbackUrl.host}
        </span>
      )}

      {/* Amount info */}
      {isSame ? (
        <div className="flex items-center justify-between rounded border border-border px-3 py-2 text-xs">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-mono font-medium">
            {max.toLocaleString()} sats
          </span>
        </div>
      ) : (
        <div className="flex gap-2 text-xs">
          <div className="flex flex-1 items-center justify-between rounded border border-border px-3 py-2">
            <span className="text-muted-foreground">Min</span>
            <span className="font-mono">{min.toLocaleString()}</span>
          </div>
          <div className="flex flex-1 items-center justify-between rounded border border-border px-3 py-2">
            <span className="text-muted-foreground">Max</span>
            <span className="font-mono">{max.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Amount input */}
      {!isSame && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Amount{' '}
            <span className="text-foreground">
              <Price amount={amount} />
            </span>
          </label>
          <Input
            type="number"
            placeholder="sats"
            value={amount && amount > 0 ? amount : ''}
            onChange={e => setAmount(Number(e.target.value))}
          />
        </div>
      )}

      {/* Comment */}
      {!!commentAllowed && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Comment{' '}
            <span className="text-foreground/60">
              (max {commentAllowed} chars)
            </span>
          </label>
          <Input
            placeholder="Optional message"
            value={comment}
            onChange={e =>
              setComment(e.target.value.substring(0, commentAllowed))
            }
          />
        </div>
      )}

      <Button
        variant="outline"
        disabled={loading || !amount}
        className="mt-1 w-full"
        onClick={() => {
          if (min && amount < min) {
            toast.error('Amount is below the minimum');
          } else if (max && amount > max) {
            toast.error('Amount is above the maximum');
          } else {
            payLnUrl({ variables: { callback, amount, comment } });
          }
        }}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          `Pay ${amount.toLocaleString()} sats`
        )}
      </Button>
    </div>
  );
};
