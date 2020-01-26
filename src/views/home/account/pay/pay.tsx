import React, { useState } from 'react';
import { Sub4Title, SingleLine } from '../../../../components/generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { PAY_INVOICE } from '../../../../graphql/mutation';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { Input } from '../../../../components/input/Input';
import { useSize } from '../../../../hooks/UseSize';
import styled from 'styled-components';

const ResponsiveLine = styled(SingleLine)`
    width: 100%;

    @media (max-width: 578px) {
        flex-direction: column;
    }
`;

export const PayCard = ({ color }: { color: string }) => {
    const { width } = useSize();
    const [request, setRequest] = useState('');

    const [makePayment, { loading }] = useMutation(PAY_INVOICE, {
        onError: error => toast.error(getErrorContent(error)),
        onCompleted: () => toast.success('Payment Sent!'),
    });

    return (
        <ResponsiveLine>
            <Sub4Title>Request:</Sub4Title>
            <Input
                placeholder={'Lightning Invoice'}
                withMargin={width <= 578 ? '0 0 16px' : '0 0 0 24px'}
                color={color}
                onChange={e => setRequest(e.target.value)}
            />
            <SecureButton
                callback={makePayment}
                variables={{ request }}
                disabled={request === ''}
                withMargin={width <= 578 ? '0' : '0 0 0 16px'}
                arrow={true}
                loading={loading}
                fullWidth={width <= 578}
            >
                Send Sats
            </SecureButton>
        </ResponsiveLine>
    );
};
