import React, { useState, useEffect } from 'react';
import {
    Card,
    Input,
    SingleLine,
    Separation,
    DarkSubTitle,
    ColorButton,
    NoWrapTitle,
} from '../../generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { Circle, ChevronRight } from '../../generic/Icons';
import { useAccount } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import { OPEN_CHANNEL } from '../../../graphql/mutation';
import { getErrorContent } from '../../../utils/error';
import { toast } from 'react-toastify';
import { getValue } from '../../../helpers/Helpers';
import { useSettings } from '../../../context/SettingsContext';
import { useBitcoinInfo } from '../../../context/BitcoinContext';
import styled from 'styled-components';
import { textColorMap } from '../../../styles/Themes';

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

interface OpenChannelProps {
    color: string;
    setOpenCard: (card: string) => void;
}

export const OpenChannelCard = ({ color, setOpenCard }: OpenChannelProps) => {
    const [size, setSize] = useState(0);
    const [fee, setFee] = useState(0);
    const [publicKey, setPublicKey] = useState('');
    const [privateChannel, setPrivateChannel] = useState(false);
    const [type, setType] = useState('none');

    const { fast, halfHour, hour } = useBitcoinInfo();

    const { price, symbol, currency, theme } = useSettings();
    const priceProps = { price, symbol, currency };

    const { host, read, cert } = useAccount();
    const auth = getAuthString(host, read, cert);

    const [openChannel] = useMutation(OPEN_CHANNEL, {
        onError: error => toast.error(getErrorContent(error)),
        onCompleted: () => {
            toast.success('Channel Opened!');
            setOpenCard('none');
        },
    });

    useEffect(() => {
        if (type === 'none' && fee === 0) {
            setFee(fast);
        }
    }, [type, fee, fast]);

    const getFormat = (amount: string | number) =>
        getValue({
            amount,
            ...priceProps,
        });

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

    return (
        <Card bottom={'20px'}>
            <SingleLine>
                <NoWrapTitle>Node Public Key:</NoWrapTitle>
                <Input
                    color={color}
                    onChange={e => setPublicKey(e.target.value)}
                />
            </SingleLine>
            <SingleLine>
                <NoWrapTitle>Channel Size:</NoWrapTitle>
                <ButtonRow>
                    <DarkSubTitle>{`(${getFormat(size)})`}</DarkSubTitle>
                    <SmallInput
                        color={color}
                        type={'number'}
                        onChange={e => setSize(parseInt(e.target.value))}
                    />
                </ButtonRow>
            </SingleLine>
            <SingleLine>
                <NoWrapTitle>Private Channel:</NoWrapTitle>
                <ButtonRow>
                    {renderButton(
                        () => setPrivateChannel(true),
                        'Yes',
                        privateChannel,
                    )}
                    {renderButton(
                        () => setPrivateChannel(false),
                        'No',
                        !privateChannel,
                    )}
                </ButtonRow>
            </SingleLine>
            <SingleLine>
                <NoWrapTitle>Fee:</NoWrapTitle>
                <ButtonRow>
                    {renderButton(
                        () => {
                            setType('none');
                            setFee(fast);
                        },
                        'Auto',
                        type === 'none',
                    )}
                    {renderButton(
                        () => setType('fee'),
                        'Fee (Sats/Byte)',
                        type === 'fee',
                    )}
                </ButtonRow>
            </SingleLine>
            <SingleLine>
                <NoWrapTitle>Fee Amount:</NoWrapTitle>
                {type !== 'none' && (
                    <ButtonRow>
                        <DarkSubTitle>{`(~${getFormat(
                            fee * 223,
                        )})`}</DarkSubTitle>
                        <SmallInput
                            color={color}
                            type={'number'}
                            onChange={e => setFee(parseInt(e.target.value))}
                        />
                    </ButtonRow>
                )}
                {type === 'none' && (
                    <ButtonRow>
                        {renderButton(
                            () => setFee(fast),
                            `Fastest (${fast} sats)`,
                            fee === fast,
                        )}
                        {halfHour !== fast &&
                            renderButton(
                                () => setFee(halfHour),
                                `Half Hour (${halfHour} sats)`,
                                fee === halfHour,
                            )}
                        {renderButton(
                            () => setFee(hour),
                            `Hour (${hour} sats)`,
                            fee === hour,
                        )}
                    </ButtonRow>
                )}
            </SingleLine>
            <Separation />
            <RightButton
                color={color}
                onClick={() => {
                    openChannel({
                        variables: {
                            auth,
                            amount: size,
                            partnerPublicKey: publicKey,
                            tokensPerVByte: fee,
                            isPrivate: privateChannel,
                        },
                    });
                }}
            >
                Open Channel
                <ChevronRight />
            </RightButton>
        </Card>
    );
};
