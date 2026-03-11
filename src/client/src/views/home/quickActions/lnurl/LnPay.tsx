import { FC, useState } from 'react';
import { PayRequest } from '../../../../graphql/types';
import { Title } from '../../../../components/typography/Styled';
import { Separation } from '../../../../components/generic/Styled';
import { renderLine } from '../../../../components/generic/helpers';
import { Input } from '@/components/ui/input';
import { Price } from '../../../../components/price/Price';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
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
  const [comment, setComment] = useState<string>('');

  const [payLnUrl, { data, loading }] = usePayLnUrlMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!callback) {
    return (
      <div className="w-full text-center">
        Missing information from LN Service
      </div>
    );
  }

  const callbackUrl = new URL(callback);

  if (!loading && data?.lnUrlPay.tag) {
    const { tag, url, description, message, ciphertext, iv } = data.lnUrlPay;
    if (tag === 'url') {
      return (
        <>
          <Title>Success</Title>
          {(description || url) && <Separation />}
          {description && (
            <div className="w-full text-center">{description}</div>
          )}
          {url && (
            <div className="w-full text-center my-4 mb-8 text-2xl">
              <Link href={url}>{url}</Link>
            </div>
          )}
        </>
      );
    }
    if (tag === 'message') {
      return (
        <>
          <Title>Success</Title>
          {message && <Separation />}
          {message && <div className="w-full text-center">{message}</div>}
        </>
      );
    }
    if (tag === 'aes') {
      return (
        <>
          <Title>Success</Title>
          {(description || ciphertext || iv) && <Separation />}
          {description && (
            <div className="w-full text-center">{description}</div>
          )}
          {renderLine('Ciphertext', ciphertext)}
          {renderLine('IV', iv)}
        </>
      );
    }
    return <Title>Success</Title>;
  }

  return (
    <>
      <Title>{title || 'Pay'}</Title>
      <Separation />
      {!title && (
        <>
          <div className="w-full text-center">{`Pay to ${callbackUrl.host}`}</div>
          <Separation />
        </>
      )}
      {isSame && renderLine('Pay Amount (sats)', max)}
      {!isSame && renderLine('Max Pay Amount (sats)', max)}
      {!isSame && renderLine('Min Pay Amount (sats)', min)}
      <Separation />
      {!!commentAllowed && (
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>{`Comment (Max ${commentAllowed} characters)`}</span>
          </div>
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '300px' }}
            value={comment}
            onChange={e =>
              setComment(e.target.value.substring(0, commentAllowed))
            }
          />
        </div>
      )}
      {!isSame && (
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>Amount</span>
            <span className="text-muted-foreground mx-2 ml-4">
              <Price amount={amount} />
            </span>
          </div>
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '300px' }}
            type={'number'}
            value={amount && amount > 0 ? amount : ''}
            onChange={e => setAmount(Number(e.target.value))}
          />
        </div>
      )}
      <Button
        variant="outline"
        disabled={loading || !amount}
        className="w-full"
        style={{ margin: '16px 0 0' }}
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
          <>{`Pay (${amount} sats)`}</>
        )}
      </Button>
    </>
  );
};
