import React, { useState, useEffect } from 'react';
import { CLOSE_CHANNEL } from '../../graphql/mutation';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
    Input,
    SimpleButton,
    Separation,
    SingleLine,
    SubTitle,
    NoWrapTitle,
    Sub4Title,
    ColorButton,
} from '../generic/Styled';
import { Circle, AlertTriangle } from '../generic/Icons';
import styled from 'styled-components';
import { textColor, chartLinkColor, textColorMap } from '../../styles/Themes';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { GET_BITCOIN_FEES } from '../../graphql/query';
import { useSettings } from '../../context/SettingsContext';
import { SecureButton } from '../buttons/secureButton/SecureButton';

interface CloseChannelProps {
    setModalOpen: (status: boolean) => void;
    channelId: string;
    channelName: string;
}

interface ButtonProps {
    color: string;
    selected?: boolean;
}

const Button = styled(SimpleButton)`
    min-width: 70px;
    border: 1px solid
        ${({ color, selected }: ButtonProps) =>
            selected ? color : chartLinkColor};

    &:hover {
        border: 1px solid ${({ color }: ButtonProps) => color};
        color: ${textColor};
    }
`;

const ButtonRow = styled.div`
    display: flex;
    width: auto;
`;

const WarningCard = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const CenterLine = styled(SingleLine)`
    justify-content: center;
`;

const RadioText = styled.div`
    margin-left: 10px;
`;

const SmallInput = styled(Input)`
    max-width: 150px;
`;

export const CloseChannel = ({
    setModalOpen,
    channelId,
    channelName,
}: CloseChannelProps) => {
    const [isForce, setIsForce] = useState<boolean>(false);
    const [isType, setIsType] = useState<string>('none');
    const [amount, setAmount] = useState<number>(0);
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

    const [fast, setFast] = useState(0);
    const [halfHour, setHalfHour] = useState(0);
    const [hour, setHour] = useState(0);

    const { theme } = useSettings();

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

    const [closeChannel] = useMutation(CLOSE_CHANNEL, {
        onCompleted: data => {
            if (data.closeChannel) {
                toast.success('Channel Closed');
            }
        },
        onError: error => toast.error(getErrorContent(error)),
        refetchQueries: [
            'GetChannels',
            'GetPendingChannels',
            'GetClosedChannels',
        ],
    });

    const handleOnlyClose = () => setModalOpen(false);

    const renderButton = (
        onClick: () => void,
        text: string,
        selected: boolean,
    ) => (
        <ColorButton color={textColorMap[theme]} onClick={onClick}>
            <Circle
                size={'10px'}
                fillcolor={selected ? textColorMap[theme] : ''}
            />
            <RadioText>{text}</RadioText>
        </ColorButton>
    );

    const renderWarning = () => (
        <WarningCard>
            <AlertTriangle size={'32px'} color={'red'} />
            <SubTitle>Are you sure you want to close the channel?</SubTitle>
            <Sub4Title>{`${channelName} [${channelId}]`}</Sub4Title>
            <Separation />
            <SingleLine>
                <div onClick={() => setModalOpen(false)}>
                    <SecureButton
                        callback={closeChannel}
                        variables={{
                            id: channelId,
                            forceClose: isForce,
                            ...(isType !== 'none'
                                ? isType === 'fee'
                                    ? { tokens: amount }
                                    : { target: amount }
                                : {}),
                        }}
                        color={'red'}
                        enabled={true}
                        disabled={false}
                    >
                        Close Channel
                    </SecureButton>
                </div>
                <Button color={'green'} onClick={handleOnlyClose}>
                    Cancel
                </Button>
            </SingleLine>
        </WarningCard>
    );

    const renderContent = () => (
        <>
            <SingleLine>
                <SubTitle>{`Close Channel`}</SubTitle>
                <Sub4Title>{`${channelName} [${channelId}]`}</Sub4Title>
            </SingleLine>
            <Separation />
            <SingleLine>
                <Sub4Title>Fee:</Sub4Title>
                <ButtonRow>
                    {renderButton(
                        () => setIsType('none'),
                        'Auto',
                        isType === 'none',
                    )}
                    {renderButton(
                        () => setIsType('fee'),
                        'Fee',
                        isType === 'fee',
                    )}
                    {renderButton(
                        () => setIsType('target'),
                        'Target',
                        isType === 'target',
                    )}
                </ButtonRow>
            </SingleLine>
            {isType === 'none' && (
                <SingleLine>
                    <Sub4Title>Fee Amount:</Sub4Title>
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
                </SingleLine>
            )}
            {isType !== 'none' && (
                <SingleLine>
                    <NoWrapTitle>
                        {isType === 'target'
                            ? 'Target Blocks:'
                            : 'Fee (Sats/Byte)'}
                    </NoWrapTitle>
                    <SmallInput
                        color={textColorMap[theme]}
                        min={1}
                        type={'number'}
                        onChange={e => setAmount(parseInt(e.target.value))}
                    />
                </SingleLine>
            )}
            <SingleLine>
                <Sub4Title>Force Close Channel:</Sub4Title>
                <ButtonRow>
                    {renderButton(() => setIsForce(true), `Yes`, isForce)}
                    {renderButton(() => setIsForce(false), `No`, !isForce)}
                </ButtonRow>
            </SingleLine>
            <Separation />
            <CenterLine>
                <Button color={'red'} onClick={() => setIsConfirmed(true)}>
                    Close Channel
                </Button>
                <Button color={textColorMap[theme]} onClick={handleOnlyClose}>
                    Cancel
                </Button>
            </CenterLine>
        </>
    );

    return isConfirmed ? renderWarning() : renderContent();
};
