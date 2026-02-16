import { FC, useEffect, useState } from 'react';
import { WithdrawRequest } from '../../../../graphql/types';
import styled from 'styled-components';
import { Title } from '../../../../components/typography/Styled';
import {
  DarkSubTitle,
  Separation,
} from '../../../../components/generic/Styled';
import { renderLine } from '../../../../components/generic/helpers';
import { InputWithDeco } from '../../../../components/input/InputWithDeco';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { useWithdrawLnUrlMutation } from '../../../../graphql/mutations/__generated__/lnUrl.generated';
import { useGetInvoiceStatusChangeLazyQuery } from '../../../../graphql/queries/__generated__/getInvoiceStatusChange.generated';
import { chartColors } from '../../../../styles/Themes';
import { CheckCircle } from 'lucide-react';
import { Link } from '../../../../components/link/Link';
import { getErrorContent } from '../../../../utils/error';
import { toast } from 'react-toastify';
import { Timer } from '../../account/createInvoice/Timer';

const Center = styled.div`
  margin: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalText = styled.div`
  width: 100%;
  text-align: center;
`;

type LnWithdrawProps = {
  request: WithdrawRequest;
};

export const LnWithdraw: FC<LnWithdrawProps> = ({ request }) => {
  const { minWithdrawable, maxWithdrawable, callback, defaultDescription, k1 } =
    request;

  const min = Number(minWithdrawable) / 1000 || 0;
  const max = Number(maxWithdrawable) / 1000 || 0;

  const isSame = min === max;

  const [invoiceStatus, setInvoiceStatus] = useState<string>('none');
  const [amount, setAmount] = useState<number>(min);
  const [description, setDescription] = useState<string>(
    defaultDescription || ''
  );

  const [withdraw, { data, loading }] = useWithdrawLnUrlMutation({
    onError: error => toast.error(getErrorContent(error)),
  });
  const [checkStatus, { data: statusData, loading: statusLoading, error }] =
    useGetInvoiceStatusChangeLazyQuery({
      onError: error => toast.error(getErrorContent(error)),
    });

  useEffect(() => {
    if (!loading && data?.lnUrlWithdraw) {
      checkStatus({ variables: { id: data.lnUrlWithdraw } });
    }
  }, [loading, data, checkStatus]);

  useEffect(() => {
    if (statusLoading || !statusData?.getInvoiceStatusChange) return;
    setInvoiceStatus(statusData.getInvoiceStatusChange);
  }, [statusLoading, statusData]);

  if (!callback) {
    return <ModalText>Missing information from LN Service</ModalText>;
  }

  const callbackUrl = new URL(callback);

  const renderContent = () => {
    if (error) {
      return (
        <Center>
          <DarkSubTitle>
            Failed to check status of the withdrawal. Please check the status in
            the
            <Link to={'/transactions'}> Transactions </Link>
            view
          </DarkSubTitle>
        </Center>
      );
    }
    if (invoiceStatus === 'paid') {
      return (
        <Center>
          <CheckCircle stroke={chartColors.green} size={32} />
          <Title>Paid</Title>
        </Center>
      );
    }

    if (invoiceStatus === 'not_paid' || invoiceStatus === 'timeout') {
      return (
        <Center>
          <Title>
            Check the status of this invoice in the
            <Link to={'/transactions'}> Transactions </Link>
            view
          </Title>
        </Center>
      );
    }
    if (statusLoading) {
      return (
        <>
          <Timer initialMinute={1} initialSeconds={30} />
          <div>hello</div>
        </>
      );
    }
    return (
      <>
        {isSame && renderLine('Withdraw Amount', max)}
        {!isSame && renderLine('Max Withdraw Amount', max)}
        {!isSame && renderLine('Min Withdraw Amount', min)}
        <Separation />
        <InputWithDeco
          inputMaxWidth={'300px'}
          title={'Description'}
          value={description}
          inputCallback={value => setDescription(value)}
        />
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
          loading={loading || statusLoading}
          disabled={loading || !k1 || statusLoading || !amount}
          fullWidth={true}
          withMargin={'16px 0 0'}
          onClick={() => {
            if (min && amount < min) {
              toast.warning('Amount is below the minimum');
            } else if (max && amount > max) {
              toast.warning('Amount is above the maximum');
            } else {
              withdraw({
                variables: { callback, amount, k1: k1 || '', description },
              });
            }
          }}
        >
          {`Withdraw (${amount} sats)`}
        </ColorButton>
      </>
    );
  };

  return (
    <>
      <Title>Withdraw</Title>
      <Separation />
      <ModalText>{`Withdraw from ${callbackUrl.host}`}</ModalText>
      <Separation />
      {renderContent()}
    </>
  );
};
