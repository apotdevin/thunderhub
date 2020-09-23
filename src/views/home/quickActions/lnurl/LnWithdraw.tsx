import { FC, useEffect, useState } from 'react';
import { WithdrawRequest } from 'src/graphql/types';
import styled from 'styled-components';
import { Title } from 'src/components/typography/Styled';
import { DarkSubTitle, Separation } from 'src/components/generic/Styled';
import { renderLine } from 'src/components/generic/helpers';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { useWithdrawLnUrlMutation } from 'src/graphql/mutations/__generated__/lnUrl.generated';
import { useGetInvoiceStatusChangeLazyQuery } from 'src/graphql/queries/__generated__/getInvoiceStatusChange.generated';
import { chartColors } from 'src/styles/Themes';
import { CheckCircle } from 'react-feather';
import { Link } from 'src/components/link/Link';
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
  const {
    minWithdrawable,
    maxWithdrawable,
    callback,
    defaultDescription,
    k1,
  } = request;

  const min = Number(minWithdrawable) / 1000 || 0;
  const max = Number(maxWithdrawable) / 1000 || 0;

  const isSame = min === max;

  const [invoiceStatus, setInvoiceStatus] = useState<string>('none');
  const [amount, setAmount] = useState<number>(min);
  const [description, setDescription] = useState<string>(
    defaultDescription || ''
  );

  const [withdraw, { data, loading }] = useWithdrawLnUrlMutation();
  const [
    checkStatus,
    { data: statusData, loading: statusLoading, error },
  ] = useGetInvoiceStatusChangeLazyQuery();

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
            inputCallback={value => {
              if (min && max) {
                setAmount(Math.min(max, Math.max(min, Number(value))));
              } else if (min && !max) {
                setAmount(Math.max(min, Number(value)));
              } else if (!min && max) {
                setAmount(Math.min(max, Number(value)));
              } else {
                setAmount(Number(value));
              }
            }}
          />
        )}
        <ColorButton
          loading={loading || statusLoading}
          disabled={loading || !k1 || statusLoading}
          fullWidth={true}
          withMargin={'16px 0 0'}
          onClick={() =>
            withdraw({
              variables: { callback, amount, k1: k1 || '', description },
            })
          }
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
