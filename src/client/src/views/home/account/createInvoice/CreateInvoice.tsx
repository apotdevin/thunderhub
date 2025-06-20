import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Check } from 'react-feather';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import { useCreateInvoiceMutation } from '../../../../graphql/mutations/__generated__/createInvoice.generated';
import { Title } from '../../../../layouts/footer/Footer.styled';
import { Link } from '../../../../components/link/Link';
import { InputWithDeco } from '../../../../components/input/InputWithDeco';
import { formatSeconds } from '../../../../utils/helpers';
import {
  MultiButton,
  SingleButton,
} from '../../../../components/buttons/multiButton/MultiButton';
import { getErrorContent } from '../../../../utils/error';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { mediaWidths, chartColors } from '../../../../styles/Themes';
import { InvoiceStatus } from './InvoiceStatus';
import { Timer } from './Timer';
import useCopyClipboard from '../../../../hooks/UseCopyToClipboard';

const Responsive = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (${mediaWidths.mobile}) {
    flex-direction: column;
  }
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WrapRequest = styled.div`
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  word-break: break-word;
  margin: 24px;
  font-size: 14px;
`;

const QRWrapper = styled.div`
  width: 280px;
  height: 280px;
  margin: 16px;
  background: white;
  padding: 16px;
`;

const Column = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CreateInvoiceCard = ({ color }: { color: string }) => {
  const [amount, setAmount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [description, setDescription] = useState('');
  const [includePrivate, setIncludePrivate] = useState(false);

  const [request, setRequest] = useState('');
  const [id, setId] = useState('');

  const [invoiceStatus, setInvoiceStatus] = useState('none');

  const [createInvoice, { data, loading }] = useCreateInvoiceMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  const [isCopied, copy] = useCopyClipboard({ successDuration: 1000 });

  useEffect(() => {
    if (!loading && data && data.createInvoice) {
      setRequest(data.createInvoice.request);
      setId(data.createInvoice.id);
    }
  }, [data, loading]);

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

  const renderQr = () => (
    <>
      <Timer initialMinute={1} initialSeconds={30} />
      <Responsive>
        <InvoiceStatus id={id} callback={status => setInvoiceStatus(status)} />
        <QRWrapper>
          <QRCodeSVG value={`lightning:${request}`} size={248} />
        </QRWrapper>
        <Column>
          <WrapRequest>{request}</WrapRequest>
          <button onClick={() => copy(request)}>
            <ColorButton>
              {isCopied ? <Check size={18} /> : <Copy size={18} />}
              Copy
            </ColorButton>
          </button>
        </Column>
      </Responsive>
    </>
  );

  const handleEnter = () => {
    if (amount === 0) return;
    createInvoice({
      variables: { amount, description, secondsUntil: seconds, includePrivate },
    });
  };

  const renderContent = () => (
    <>
      <InputWithDeco
        title={'Amount to receive'}
        value={amount}
        placeholder={'sats'}
        amount={amount}
        inputType={'number'}
        inputCallback={value => setAmount(Number(value))}
        color={color}
        onEnter={() => handleEnter()}
      />
      <InputWithDeco
        title={'Description'}
        value={description}
        placeholder={'description'}
        inputCallback={value => setDescription(value)}
        color={color}
        onEnter={() => handleEnter()}
      />
      <InputWithDeco
        title={'Expires in'}
        value={seconds}
        placeholder={'seconds until expiration'}
        inputCallback={value => setSeconds(Number(value))}
        customAmount={formatSeconds(seconds) || ''}
        color={color}
        onEnter={() => handleEnter()}
      />
      <InputWithDeco title={'Include Private Channels'} noInput={true}>
        <MultiButton>
          <SingleButton
            onClick={() => setIncludePrivate(true)}
            selected={includePrivate}
          >
            Yes
          </SingleButton>
          <SingleButton
            onClick={() => setIncludePrivate(false)}
            selected={!includePrivate}
          >
            No
          </SingleButton>
        </MultiButton>
      </InputWithDeco>
      <ColorButton
        onClick={() => handleEnter()}
        disabled={amount === 0}
        withMargin={'16px 0 0'}
        arrow={true}
        loading={loading}
        fullWidth={true}
      >
        Create Invoice
      </ColorButton>
    </>
  );

  return request !== '' ? renderQr() : renderContent();
};
