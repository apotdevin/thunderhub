import { FC, useState } from 'react';
import { PayRequest } from '../../../../graphql/types';
import { Input } from '@/components/ui/input';
import { Price } from '../../../../components/price/Price';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import { usePayLnUrlMutation } from '../../../../graphql/mutations/__generated__/lnUrl.generated';
import { Link } from '../../../../components/link/Link';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../../../utils/error';

type LnPayProps = {
  request: PayRequest;
  defaultAmount?: number;
  hideTitle?: boolean;
};

export const LnPay: FC<LnPayProps> = ({
  request,
  defaultAmount,
  hideTitle,
}) => {
  const { minSendable, maxSendable, callback, commentAllowed } = request;

  const min = Number(minSendable) / 1000 || 0;
  const max = Number(maxSendable) / 1000 || 0;

  const isSame = min === max;

  const initial = isSame ? min : (defaultAmount ?? min);
  const [amount, setAmount] = useState<number>(initial);
  const [comment, setComment] = useState('');
  const [confirming, setConfirming] = useState(false);

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
      {!hideTitle && (
        <span className="text-sm text-center uppercase font-semibold">
          {`Pay to ${callbackUrl.host}`}
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
        <div className="grid grid-cols-2 gap-2">
          <Badge variant="secondary" className="font-normal w-full">
            Min:{' '}
            <span className="font-mono ml-1">{min.toLocaleString()} sats</span>
          </Badge>
          <Badge variant="secondary" className="font-normal w-full">
            Max:{' '}
            <span className="font-mono ml-1">{max.toLocaleString()} sats</span>
          </Badge>
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

      {confirming ? (
        <div className="mt-1 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={loading}
            onClick={() => setConfirming(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="flex-1"
            disabled={loading}
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
              `Confirm Pay`
            )}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          disabled={!amount}
          className="mt-1 w-full"
          onClick={() => setConfirming(true)}
        >
          Pay {amount.toLocaleString()} sats <ChevronRight size={18} />
        </Button>
      )}
    </div>
  );
};
