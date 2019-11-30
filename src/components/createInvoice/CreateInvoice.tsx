import React, { useState } from 'react';
import { CardWithTitle, SubTitle, Card, Sub4Title } from '../generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_INVOICE } from '../../graphql/mutation';
import { Edit } from '../generic/Icons';
import styled from 'styled-components';
import { textColor, buttonBorderColor } from '../../styles/Themes';

const SingleLine = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SimpleButton = styled.button`
    padding: 5px;
    margin: 5px;
    text-decoration: none;
    background-color: transparent;
    color: ${textColor};
    border: 1px solid ${buttonBorderColor};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    white-space: nowrap;
`;

const NoWrapTitle = styled(Sub4Title)`
    white-space: nowrap;
`;

const Input = styled.input`
    width: 100%;
    margin: 10px 20px;
    border: 0;
    border-bottom: 2px solid #c8ccd4;
    background: none;
    border-radius: 0;
    color: ${textColor};
    transition: all 0.5s ease;

    &:hover {
        border-bottom: 2px solid #0077ff;
    }

    &:focus {
        outline: none;
        background: none;
        border-bottom: 2px solid #0077ff;
    }
`;

export const CreateInvoiceCard = () => {
    const [amount, setAmount] = useState(10000);
    const [createInvoice, { data, loading, error }] = useMutation(
        CREATE_INVOICE,
    );

    // console.log(data, loading, error);

    return (
        <CardWithTitle>
            <SubTitle>Receive Sats</SubTitle>
            <Card bottom={'25px'}>
                <SingleLine>
                    <NoWrapTitle>Amount to receive:</NoWrapTitle>
                    <Input type={'number'} onChange={e => setAmount(10000)} />
                    <SimpleButton
                        onClick={() => {
                            createInvoice({ variables: { amount: 10000 } });
                        }}
                    >
                        <Edit />
                        Create Invoice
                    </SimpleButton>
                </SingleLine>
            </Card>
        </CardWithTitle>
    );
};
