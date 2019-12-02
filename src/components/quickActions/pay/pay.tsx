import React, { useState, useContext } from 'react';
import {
    Card,
    Sub4Title,
    Input,
    SingleLine,
    ColorButton,
} from '../../generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { PAY_INVOICE } from '../../../graphql/mutation';
import { Send } from '../../generic/Icons';
import { AccountContext } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';

export const PayCard = ({ color }: { color: string }) => {
    const [request, setRequest] = useState('');

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const [makePayment, { data, loading, error }] = useMutation(PAY_INVOICE);

    console.log(data, loading, error);

    return (
        <Card bottom={'20px'}>
            <SingleLine>
                <Sub4Title>Request:</Sub4Title>
                <Input
                    color={color}
                    onChange={e => setRequest(e.target.value)}
                />
                <ColorButton
                    color={color}
                    disabled={request === ''}
                    enabled={request !== ''}
                    onClick={() => {
                        makePayment({ variables: { request, auth } });
                    }}
                >
                    <Send />
                    Send Sats
                </ColorButton>
            </SingleLine>
        </Card>
    );
};
