import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle } from 'react-feather';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import QRCode from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useCreateInvoiceMutation } from 'src/graphql/mutations/__generated__/createInvoice.generated';
import { Title } from 'src/layouts/footer/Footer.styled';
import { Link } from 'src/components/link/Link';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { getErrorContent } from '../../../../utils/error';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { mediaWidths, chartColors } from '../../../../styles/Themes';
import { InvoiceStatus } from './InvoiceStatus';
import { Timer } from './Timer';

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
  const [description, setDescription] = useState('');

  const [request, setRequest] = useState('');
  const [id, setId] = useState('');

  const [invoiceStatus, setInvoiceStatus] = useState('none');

  const [createInvoice, { data, loading }] = useCreateInvoiceMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

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
          <QRCode value={`lightning:${request}`} renderAs={'svg'} size={248} />
        </QRWrapper>
        <Column>
          <WrapRequest>{request}</WrapRequest>
          <CopyToClipboard
            text={request}
            onCopy={() => toast.success('Request Copied')}
          >
            <ColorButton>
              <Copy size={18} />
              Copy
            </ColorButton>
          </CopyToClipboard>
        </Column>
      </Responsive>
    </>
  );

  const renderContent = () => (
    <>
      <InputWithDeco
        title={'Amount to receive'}
        value={amount}
        placeholder={'Sats'}
        amount={amount}
        inputType={'number'}
        inputCallback={value => setAmount(Number(value))}
        color={color}
      />
      <InputWithDeco
        title={'Description'}
        value={description}
        placeholder={'Description'}
        inputCallback={value => setDescription(value)}
        color={color}
      />
      <ColorButton
        onClick={() => createInvoice({ variables: { amount, description } })}
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
