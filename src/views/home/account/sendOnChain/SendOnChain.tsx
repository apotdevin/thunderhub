import React, { useState, useEffect } from 'react';
import {
    Card,
    ColorButton,
    NoWrapTitle,
    DarkSubTitle,
    Separation,
    SingleLine,
} from '../../../../components/generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { PAY_ADDRESS } from '../../../../graphql/mutation';
import { Circle } from '../../../../components/generic/Icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { useSettings } from '../../../../context/SettingsContext';
import { getValue } from '../../../../helpers/Helpers';
import { useBitcoinInfo } from '../../../../context/BitcoinContext';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { textColorMap } from '../../../../styles/Themes';
import { Input } from '../../../../components/input/Input';
import { NoWrap } from '../../../backups/Backups';

const RadioText = styled.div`
    margin-left: 10px;
`;

const ButtonRow = styled.div`
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Margin = styled.div`
    margin-left: 24px;
`;

export const SendOnChainCard = ({ color }: { color: string }) => {
    const [address, setAddress] = useState('');
    const [tokens, setTokens] = useState(0);
    const [type, setType] = useState('none');
    const [amount, setAmount] = useState(0);
    const [sendAll, setSendAll] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const canSend = address !== '' && (sendAll || tokens > 0) && amount > 0;

    const { theme } = useSettings();
    const { price, symbol, currency } = useSettings();
    const { fast, halfHour, hour } = useBitcoinInfo();

    useEffect(() => {
        if (type === 'none' && amount === 0) {
            setAmount(fast);
        }
    }, [type, amount, fast]);

    const [payAddress, { data, loading }] = useMutation(PAY_ADDRESS, {
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
        if (type === 'fee' || type === 'none') {
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
            <Circle
                size={'10px'}
                fillcolor={selected ? textColorMap[theme] : ''}
            />
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
        <>
            <SingleLine>
                <NoWrapTitle>Send to Address:</NoWrapTitle>
                <Input
                    withMargin={'0 0 0 24px'}
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
                    <Margin>
                        <DarkSubTitle>{`(${getFormat(tokens)})`}</DarkSubTitle>
                    </Margin>
                    <Input
                        withMargin={'0 0 0 8px'}
                        color={color}
                        type={'number'}
                        onChange={e => setTokens(parseInt(e.target.value))}
                    />
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
                        <NoWrap>
                            <DarkSubTitle>{`(~${
                                type === 'target'
                                    ? `${amount} blocks`
                                    : feeFormat(amount * 223)
                            })`}</DarkSubTitle>
                        </NoWrap>
                        <Input
                            color={color}
                            type={'number'}
                            onChange={e => setAmount(parseInt(e.target.value))}
                        />
                    </ButtonRow>
                )}
                {type === 'none' && (
                    <ButtonRow>
                        <NoWrap>
                            <DarkSubTitle>{`(~${feeFormat(
                                amount * 223,
                            )})`}</DarkSubTitle>
                        </NoWrap>
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
            <SecureButton
                callback={payAddress}
                variables={{ address, ...typeAmount, ...tokenAmount }}
                disabled={!canSend}
                withMargin={'16px 0 0'}
                fullWidth={true}
                arrow={true}
                loading={loading}
            >
                Send To Address
            </SecureButton>
        </>
    );
};
