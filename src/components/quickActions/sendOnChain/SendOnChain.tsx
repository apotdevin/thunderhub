import React, { useState, useContext, useEffect } from 'react';
import {
    Card,
    Input,
    ColorButton,
    NoWrapTitle,
    DarkSubTitle,
    Separation,
} from '../../generic/Styled';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { PAY_ADDRESS } from '../../../graphql/mutation';
import { Send, Circle } from '../../generic/Icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { AccountContext } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import { SettingsContext } from '../../../context/SettingsContext';
import { getValue } from '../../../helpers/Helpers';
import { GET_BITCOIN_FEES } from '../../../graphql/query';

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

    const [fast, setFast] = useState(0);
    const [halfHour, setHalfHour] = useState(0);
    const [hour, setHour] = useState(0);

    const { price, symbol, currency } = useContext(SettingsContext);

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const { data: feeData } = useQuery(GET_BITCOIN_FEES, {
        onError: error => toast.error(getErrorContent(error)),
    });

    useEffect(() => {
        if (feeData && feeData.getBitcoinFees) {
            const { fast, halfHour, hour } = feeData.getBitcoinFees;
            setAmount(fast);
            setFast(fast);
            setHalfHour(halfHour);
            setHour(hour);
        }
    }, [feeData]);

    const [payAddress, { data }] = useMutation(PAY_ADDRESS, {
        onError: error => toast.error(getErrorContent(error)),
    });

    useEffect(() => {
        if (data && data.sendToAddress && data.sendToAddress.id) {
            setIsSent(true);
            toast.success('Payment Sent!');
        }
    }, [data]);

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

    const renderButton = (
        onClick: () => void,
        text: string,
        selected: boolean,
    ) => (
        <ColorButton color={color} onClick={onClick}>
            <Circle size={'10px'} fillcolor={selected ? 'white' : ''} />
            <RadioText>{text}</RadioText>
        </ColorButton>
    );

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
            <Separation />
            <SingleLine>
                <NoWrapTitle>Send All:</NoWrapTitle>
                <ButtonRow>
                    {renderButton(() => setSendAll(true), 'Yes', sendAll)}
                    {renderButton(() => setSendAll(false), 'No', !sendAll)}
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
            <Separation />
            <SingleLine>
                <NoWrapTitle>Fee:</NoWrapTitle>
                <ButtonRow>
                    {renderButton(
                        () => {
                            setType('none');
                            setAmount(fast);
                        },
                        'Auto',
                        type === 'none',
                    )}
                    {renderButton(
                        () => setType('fee'),
                        'Fee (Sats/Byte)',
                        type === 'fee',
                    )}
                    {renderButton(
                        () => setType('target'),
                        'Target Confirmations',
                        type === 'target',
                    )}
                </ButtonRow>
            </SingleLine>
            <SingleLine>
                <NoWrapTitle>Fee Amount:</NoWrapTitle>
                {type !== 'none' && (
                    <ButtonRow>
                        <DarkSubTitle>
                            {`(${feeFormat(amount)})`}
                        </DarkSubTitle>
                        <SmallInput
                            color={color}
                            type={'number'}
                            onChange={e => setAmount(parseInt(e.target.value))}
                        />
                    </ButtonRow>
                )}
                {type === 'none' && (
                    <ButtonRow>
                        {renderButton(
                            () => setAmount(fast),
                            `Fastest (${fast} sats)`,
                            amount === fast,
                        )}
                        {halfHour !== fast &&
                            renderButton(
                                () => setAmount(halfHour),
                                `Half Hour (${halfHour} sats)`,
                                amount === halfHour,
                            )}
                        {renderButton(
                            () => setAmount(hour),
                            `Hour (${hour} sats)`,
                            amount === hour,
                        )}
                    </ButtonRow>
                )}
            </SingleLine>
            <Separation />
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
