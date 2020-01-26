import React, { useState, useEffect } from 'react';
import { NoWrapTitle } from '../../../../components/generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_INVOICE } from '../../../../graphql/mutation';
import { Copy } from '../../../../components/generic/Icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import QRCode from 'qrcode.react';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Input } from '../../../../components/input/Input';
import { useSize } from '../../../../hooks/UseSize';

const SingleLine = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Responsive = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 578px) {
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
    width: 200px;
    margin: 16px;
`;

const Column = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const ResponsiveLine = styled(SingleLine)`
    width: 100%;

    @media (max-width: 578px) {
        flex-direction: column;
    }
`;

export const CreateInvoiceCard = ({ color }: { color: string }) => {
    const { width } = useSize();
    const [amount, setAmount] = useState(0);
    const [request, setRequest] = useState('');

    const [createInvoice, { data, loading }] = useMutation(CREATE_INVOICE, {
        onError: error => toast.error(getErrorContent(error)),
    });

    useEffect(() => {
        if (
            !loading &&
            data &&
            data.createInvoice &&
            data.createInvoice.request
        ) {
            setRequest(data.createInvoice.request);
        }
    }, [data, loading]);

    const renderQr = () => (
        <Responsive>
            <QRWrapper>
                <QRCode
                    value={`lightning:${request}`}
                    renderAs={'svg'}
                    size={200}
                />
            </QRWrapper>
            <Column>
                <WrapRequest>{request}</WrapRequest>
                <CopyToClipboard
                    text={request}
                    onCopy={() => toast.success('Request Copied')}
                >
                    <ColorButton>
                        <Copy />
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
                withMargin={width <= 578 ? '0 0 16px' : '0 0 0 24px'}
                color={color}
                type={'number'}
                onChange={e => setAmount(parseInt(e.target.value))}
            />
            <SecureButton
                callback={createInvoice}
                variables={{ amount }}
                disabled={amount === 0}
                withMargin={width <= 578 ? '' : '0 0 0 16px'}
                arrow={true}
                loading={loading}
                fullWidth={width <= 578}
            >
                Create Invoice
            </SecureButton>
        </ResponsiveLine>
    );

    return request !== '' ? renderQr() : renderContent();
};
