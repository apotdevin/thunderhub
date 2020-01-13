import React, { useState } from 'react';
import {
    Sub4Title,
    Input,
    SingleLine,
} from '../../../../components/generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { PAY_INVOICE } from '../../../../graphql/mutation';
import { Send } from '../../../../components/generic/Icons';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { SecureButton } from '../../../../components/secureButton/SecureButton';

export const PayCard = ({ color }: { color: string }) => {
    const [request, setRequest] = useState('');

    const [makePayment] = useMutation(PAY_INVOICE, {
        onError: error => toast.error(getErrorContent(error)),
        onCompleted: () => toast.success('Payment Sent!'),
    });

    return (
        <SingleLine>
            <Sub4Title>Request:</Sub4Title>
            <Input color={color} onChange={e => setRequest(e.target.value)} />
            <SecureButton
                callback={makePayment}
                variables={{ request }}
                color={color}
                enabled={request !== ''}
                disabled={request === ''}
            >
                <Send />
                Send Sats
            </SecureButton>
        </SingleLine>
    );
};
