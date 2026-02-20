import { FC, useState } from 'react';
import { PayRequest } from '../../../../graphql/types';
import styled from 'styled-components';
import { Title } from '../../../../components/typography/Styled';
import { Separation } from '../../../../components/generic/Styled';
import { renderLine } from '../../../../components/generic/helpers';
import { InputWithDeco } from '../../../../components/input/InputWithDeco';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { usePayLnUrlMutation } from '../../../../graphql/mutations/__generated__/lnUrl.generated';
import { Link } from '../../../../components/link/Link';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../../../utils/error';

const ModalText = styled.div`
  width: 100%;
  text-align: center;
`;

const StyledLink = styled(ModalText)`
  margin: 16px 0 32px;
  font-size: 24px;
`;

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
    return <ModalText>Missing information from LN Service</ModalText>;
  }

  const callbackUrl = new URL(callback);

  if (!loading && data?.lnUrlPay.tag) {
    const { tag, url, description, message, ciphertext, iv } = data.lnUrlPay;
    if (tag === 'url') {
      return (
        <>
          <Title>Success</Title>
          {(description || url) && <Separation />}
          {description && <ModalText>{description}</ModalText>}
          {url && (
            <StyledLink>
              <Link href={url}>{url}</Link>
            </StyledLink>
          )}
        </>
      );
    }
    if (tag === 'message') {
      return (
        <>
          <Title>Success</Title>
          {message && <Separation />}
          {message && <ModalText>{message}</ModalText>}
        </>
      );
    }
    if (tag === 'aes') {
      return (
        <>
          <Title>Success</Title>
          {(description || ciphertext || iv) && <Separation />}
          {description && <ModalText>{description}</ModalText>}
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
          <ModalText>{`Pay to ${callbackUrl.host}`}</ModalText>
          <Separation />
        </>
      )}
      {isSame && renderLine('Pay Amount (sats)', max)}
      {!isSame && renderLine('Max Pay Amount (sats)', max)}
      {!isSame && renderLine('Min Pay Amount (sats)', min)}
      <Separation />
      {!!commentAllowed && (
        <InputWithDeco
          inputMaxWidth={'300px'}
          title={`Comment (Max ${commentAllowed} characters)`}
          value={comment}
          inputCallback={value => {
            setComment(value.substring(0, commentAllowed));
          }}
        />
      )}
      {!isSame && (
        <InputWithDeco
          inputMaxWidth={'300px'}
          title={'Amount'}
          amount={amount}
          value={amount}
          inputType={'number'}
          inputCallback={value => setAmount(Number(value))}
        />
      )}
      <ColorButton
        loading={loading}
        disabled={loading || !amount}
        fullWidth={true}
        withMargin={'16px 0 0'}
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
        {`Pay (${amount} sats)`}
      </ColorButton>
    </>
  );
};
