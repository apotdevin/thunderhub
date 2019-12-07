import React, { useState, useContext } from 'react';
import { Card, Input, ColorButton, NoWrapTitle } from '../../generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_INVOICE } from '../../../graphql/mutation';
import { Edit } from '../../generic/Icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { AccountContext } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';

const SingleLine = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const CreateInvoiceCard = ({ color }: { color: string }) => {
    const [amount, setAmount] = useState(0);

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const [createInvoice, { data, loading }] = useMutation(CREATE_INVOICE, {
        onError: error => toast.error(getErrorContent(error)),
    });

    console.log(data, loading);

    return (
        <Card>
            <SingleLine>
                <NoWrapTitle>Amount to receive:</NoWrapTitle>
                <Input
                    color={color}
                    type={'number'}
                    onChange={e => setAmount(10000)}
                />
                <ColorButton
                    color={color}
                    disabled={amount === 0}
                    enabled={amount > 0}
                    onClick={() => {
                        createInvoice({ variables: { amount, auth } });
                    }}
                >
                    <Edit />
                    Create Invoice
                </ColorButton>
            </SingleLine>
        </Card>
    );
};
