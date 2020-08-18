import React, { useState, useEffect } from 'react';
import { Copy } from 'react-feather';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import QRCode from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useCreateInvoiceMutation } from 'src/graphql/mutations/__generated__/createInvoice.generated';
import { getErrorContent } from '../../../../utils/error';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import {
  NoWrapTitle,
  ResponsiveLine,
} from '../../../../components/generic/Styled';
import { Input } from '../../../../components/input';
import { mediaWidths } from '../../../../styles/Themes';

const Responsive = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (${mediaWidths.mobile}) {
    flex-direction: column;
  }
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
  const [request, setRequest] = useState('');

  const [createInvoice, { data, loading }] = useCreateInvoiceMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.createInvoice && data.createInvoice.request) {
      setRequest(data.createInvoice.request);
    }
  }, [data, loading]);

  const renderQr = () => (
    <Responsive>
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
  );

  const renderContent = () => (
    <ResponsiveLine>
      <NoWrapTitle>Amount to receive:</NoWrapTitle>
      <Input
        placeholder={'Sats'}
        withMargin={'0 0 0 16px'}
        mobileMargin={'0 0 16px'}
        color={color}
        type={'number'}
        onChange={e => setAmount(Number(e.target.value))}
      />
      <ColorButton
        onClick={() => createInvoice({ variables: { amount } })}
        disabled={amount === 0}
        withMargin={'0 0 0 16px'}
        mobileMargin={'0'}
        arrow={true}
        loading={loading}
        mobileFullWidth={true}
      >
        Create Invoice
      </ColorButton>
    </ResponsiveLine>
  );

  return request !== '' ? renderQr() : renderContent();
};
