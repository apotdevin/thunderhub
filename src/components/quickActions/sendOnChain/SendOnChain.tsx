import React, { useState, useContext, useEffect } from 'react';
import {
    Card,
    Input,
    ColorButton,
    NoWrapTitle,
    DarkSubTitle,
} from '../../generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { PAY_ADDRESS } from '../../../graphql/mutation';
import { Send, Circle } from '../../generic/Icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { AccountContext } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import { SettingsContext } from '../../../context/SettingsContext';
import { getValue } from '../../../helpers/Helpers';

const SingleLine = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const RadioText = styled.div`
    margin-left: 10px;
`;

const ButtonRow = styled.div`
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SmallInput = styled(Input)`
    max-width: 150px;
`;

const RightButton = styled(ColorButton)`
    margin-left: auto;
`;

export const SendOnChainCard = ({ color }: { color: string }) => {
    const [address, setAddress] = useState('');
    const [tokens, setTokens] = useState(0);
    const [type, setType] = useState('none');
    const [amount, setAmount] = useState(0);
    const [sendAll, setSendAll] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const { price, symbol, currency } = useContext(SettingsContext);

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const [payAddress, { data }] = useMutation(PAY_ADDRESS, {
        onError: error => toast.error(getErrorContent(error)),
    });

    const priceProps = { price, symbol, currency };
    const getFormat = (amount: number) =>
        getValue({
            amount,
            ...priceProps,
        });

    const feeFormat = (amount: number) => {
        if (type === 'fee') {
            return getFormat(amount);
        } else {
            return `${amount} blocks`;
        }
    };

    const typeAmount =
        type === 'fee'
            ? { fee: amount }
            : type === 'target'
            ? { target: amount }
            : {};

    const tokenAmount = sendAll ? { sendAll } : { tokens };

    useEffect(() => {
        if (data && data.sendToAddress && data.sendToAddress.id) {
            setIsSent(true);
            toast.success('On Chain Payment Sent!');
        }
    }, [data]);

    if (isSent && data && data.sendToAddress && data.sendToAddress.id) {
        return (
            <Card>
                <SingleLine>
                    <DarkSubTitle>Payment Id:</DarkSubTitle>
                    {data.sendToAddress.id}
                </SingleLine>
            </Card>
        );
    }

    return (
        <Card>
            <SingleLine>
                <NoWrapTitle>Send to Address:</NoWrapTitle>
                <Input
                    color={color}
                    onChange={e => setAddress(e.target.value)}
                />
            </SingleLine>
            <SingleLine>
                <NoWrapTitle>Send All:</NoWrapTitle>
                <ButtonRow>
                    <ColorButton
                        color={color}
                        onClick={() => {
                            setSendAll(true);
                        }}
                    >
                        <Circle
                            size={'10px'}
                            fillcolor={sendAll ? 'white' : ''}
                        />
                        <RadioText>Yes</RadioText>
                    </ColorButton>
                    <ColorButton
                        color={color}
                        onClick={() => {
                            setSendAll(false);
                        }}
                    >
                        <Circle
                            size={'10px'}
                            fillcolor={!sendAll ? 'white' : ''}
                        />
                        <RadioText>No</RadioText>
                    </ColorButton>
                </ButtonRow>
            </SingleLine>
            {!sendAll && (
                <SingleLine>
                    <NoWrapTitle>Amount:</NoWrapTitle>
                    <ButtonRow>
                        <DarkSubTitle>{`(${getFormat(tokens)})`}</DarkSubTitle>
                        <SmallInput
                            color={color}
                            type={'number'}
                            onChange={e => setTokens(parseInt(e.target.value))}
                        />
                    </ButtonRow>
                </SingleLine>
            )}
            <SingleLine>
                <NoWrapTitle>Fee:</NoWrapTitle>
                <ButtonRow>
                    <ColorButton
                        color={color}
                        onClick={() => {
                            setType('none');
                        }}
                    >
                        <Circle
                            size={'10px'}
                            fillcolor={type === 'none' ? 'white' : ''}
                        />
                        <RadioText>Auto</RadioText>
                    </ColorButton>
                    <ColorButton
                        color={color}
                        onClick={() => {
                            setType('fee');
                        }}
                    >
                        <Circle
                            size={'10px'}
                            fillcolor={type === 'fee' ? 'white' : ''}
                        />
                        <RadioText>{`Fee (Sats/Byte)`}</RadioText>
                    </ColorButton>
                    <ColorButton
                        color={color}
                        onClick={() => {
                            setType('target');
                        }}
                    >
                        <Circle
                            size={'10px'}
                            fillcolor={type === 'target' ? 'white' : ''}
                        />
                        <RadioText>{`Target Confirmations`}</RadioText>
                    </ColorButton>
                </ButtonRow>
                {type !== 'none' && (
                    <ButtonRow>
                        <DarkSubTitle bottom={'0px'}>
                            {`(${feeFormat(amount)})`}
                        </DarkSubTitle>
                        <SmallInput
                            color={color}
                            type={'number'}
                            onChange={e => setAmount(parseInt(e.target.value))}
                        />
                    </ButtonRow>
                )}
            </SingleLine>
            <RightButton
                color={color}
                onClick={() => {
                    payAddress({
                        variables: {
                            auth,
                            address,
                            ...typeAmount,
                            ...tokenAmount,
                        },
                    });
                }}
            >
                <Send />
                Send To Address
            </RightButton>
        </Card>
    );
};
