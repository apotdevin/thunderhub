import React, { useState, useContext } from 'react';
import {
    CardWithTitle,
    SubTitle,
    Card,
    Sub4Title,
    Input,
    SingleLine,
    SimpleButton,
} from '../generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { PAY_INVOICE } from '../../graphql/mutation';
import { Send, Settings } from '../generic/Icons';
import { AccountContext } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';

export const PayCard = () => {
    const [request, setRequest] = useState('');

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const [makePayment, { data, loading, error }] = useMutation(PAY_INVOICE);

    console.log(data, loading, error);

    return (
        <CardWithTitle>
            <SubTitle>Send Sats</SubTitle>
            <Card bottom={'20px'}>
                <SingleLine>
                    <Sub4Title>Request:</Sub4Title>
                    <Input onChange={e => setRequest(e.target.value)} />
                    <SimpleButton>
                        <Settings />
                    </SimpleButton>
                    <SimpleButton
                        enabled={request !== ''}
                        onClick={() => {
                            makePayment({ variables: { request, auth } });
                        }}
                    >
                        <Send />
                        Send Sats
                    </SimpleButton>
                </SingleLine>
            </Card>
        </CardWithTitle>
    );
};
