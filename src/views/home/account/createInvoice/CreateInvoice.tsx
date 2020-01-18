import React, { useState } from 'react';
import { Input, NoWrapTitle } from '../../../../components/generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_INVOICE } from '../../../../graphql/mutation';
import { Edit } from '../../../../components/generic/Icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';

const SingleLine = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const CreateInvoiceCard = ({ color }: { color: string }) => {
    const [amount, setAmount] = useState(0);

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
            <SecureButton
                callback={createInvoice}
                variables={{ amount }}
                color={color}
                disabled={amount === 0}
            >
                <Edit />
                Create Invoice
            </SecureButton>
        </SingleLine>
    );
};
