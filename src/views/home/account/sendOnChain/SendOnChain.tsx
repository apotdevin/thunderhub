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
import { useSize } from '../../../../hooks/UseSize';

const RadioText = styled.div`
    margin-left: 10px;
`;

const ResponsiveWrap = styled(SingleLine)`
    @media (max-width: 578px) {
        flex-wrap: wrap;
    }
`;

const ResponsiveLine = styled(SingleLine)`
    width: 100%;

    @media (max-width: 578px) {
        flex-direction: column;
    }
`;

const ButtonRow = styled.div`
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: 578px) {
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        margin: 8px 0 8px;
    }
`;

const NoWrap = styled.div`
    margin-left: 8px;
    white-space: nowrap;
`;

const Margin = styled.div`
    margin-left: 8px;
    margin-right: 24px;
`;

export const SendOnChainCard = ({ color }: { color: string }) => {
    const { width } = useSize();
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
            <ResponsiveLine>
                <NoWrapTitle>Send to Address:</NoWrapTitle>
                <Input
                    withMargin={width <= 578 ? '' : '0 0 0 24px'}
                    color={color}
                    onChange={e => setAddress(e.target.value)}
                />
            </ResponsiveLine>
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
                    <ResponsiveWrap>
                        <NoWrapTitle>Amount:</NoWrapTitle>
                        <Margin>
                            <DarkSubTitle>{`(${getFormat(
                                tokens,
                            )})`}</DarkSubTitle>
                        </Margin>
                    </ResponsiveWrap>
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
                        () => {
                            setType('fee');
                            setAmount(0);
                        },
                        'Fee (Sats/Byte)',
                        type === 'fee',
                    )}
                    {renderButton(
                        () => {
                            setType('target');
                            setAmount(0);
                        },
                        'Target Confirmations',
                        type === 'target',
                    )}
                </ButtonRow>
            </SingleLine>
            <SingleLine>
                <ResponsiveWrap>
                    <NoWrapTitle>Fee Amount:</NoWrapTitle>
                    <NoWrap>
                        <DarkSubTitle>{`(~${
                            type === 'target'
                                ? `${amount} blocks`
                                : feeFormat(amount * 223)
                        })`}</DarkSubTitle>
                    </NoWrap>
                </ResponsiveWrap>
                {type !== 'none' && (
                    <>
                        <Input
                            color={color}
                            type={'number'}
                            withMargin={'0 0 0 8px'}
                            onChange={e => setAmount(parseInt(e.target.value))}
                        />
                    </>
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
