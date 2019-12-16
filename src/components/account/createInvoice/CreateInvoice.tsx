import React, { useState } from 'react';
import { Input, ColorButton, NoWrapTitle } from '../../generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_INVOICE } from '../../../graphql/mutation';
import { Edit } from '../../generic/Icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { useAccount } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';

const SingleLine = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const CreateInvoiceCard = ({ color }: { color: string }) => {
    const [amount, setAmount] = useState(0);

    const { host, read, cert } = useAccount();
    const auth = getAuthString(host, read, cert);

    const [createInvoice, { data, loading }] = useMutation(CREATE_INVOICE, {
        onError: error => toast.error(getErrorContent(error)),
    });

    console.log(data, loading);

    return (
        <SingleLine>
            <NoWrapTitle>Amount to receive:</NoWrapTitle>
            <Input
                color={color}
                type={'number'}
                onChange={e => setAmount(parseInt(e.target.value))}
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
    );
};
