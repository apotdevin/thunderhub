import React, { useState } from 'react';
import { getPercent, getValue } from '../../../helpers/Helpers';
import {
    Progress,
    ProgressBar,
    NodeTitle,
    StatusLine,
    MainInfo,
} from '../Channels.style';
import ReactTooltip from 'react-tooltip';
import {
    SubCard,
    Separation,
    Sub4Title,
    ColorButton,
    SingleLine,
} from '../../generic/Styled';
import { useSettings } from '../../../context/SettingsContext';
import {
    getStatusDot,
    getPrivate,
    getSymbol,
    getTooltipType,
    getFormatDate,
    getDateDif,
    renderLine,
} from '../../generic/Helpers';
import { getTransactionLink, getNodeLink } from '../../generic/Helpers';
import Modal from '../../modal/ReactModal';
import { CloseChannel } from '../../closeChannel/CloseChannel';
import styled from 'styled-components';

const CloseButton = styled(ColorButton)`
    margin-left: auto;
`;

interface ChannelCardProps {
    channelInfo: any;
    index: number;
    setIndexOpen: (index: number) => void;
    indexOpen: number;
}

export const ChannelCard = ({
    channelInfo,
    index,
    setIndexOpen,
    indexOpen,
}: ChannelCardProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const { price, symbol, currency, theme } = useSettings();
    const priceProps = { price, symbol, currency };

    const tooltipType = getTooltipType(theme);

    const getFormat = (amount: string) =>
        getValue({
            amount,
            ...priceProps,
        });

    const {
        capacity,
        commitTransactionFee,
        commitTransactionWeight,
        id,
        isActive,
        isClosing,
        isOpening,
        isPartnerInitiated,
        isPrivate,
        isStaticRemoteKey,
        localBalance,
        localReserve,
        partnerPublicKey,
        received,
        remoteBalance,
        remoteReserve,
        sent,
        timeOffline,
        timeOnline,
        transactionId,
        transactionVout,
        unsettledBalance,
        partnerNodeInfo,
    } = channelInfo;

    const {
        alias,
        capacity: nodeCapacity,
        channelCount,
        color: nodeColor,
        lastUpdate,
    } = partnerNodeInfo;

    const formatBalance = getFormat(capacity);
    const formatLocal = getFormat(localBalance);
    const formatRemote = getFormat(remoteBalance);
    const formatreceived = getFormat(received);
    const formatSent = getFormat(sent);

    const handleClick = () => {
        if (indexOpen === index) {
            setIndexOpen(0);
        } else {
            setIndexOpen(index);
        }
    };

    const renderDetails = () => {
        return (
            <>
                <Separation />
                {renderLine('Node Public Key:', getNodeLink(partnerPublicKey))}
                {renderLine(
                    'Transaction Id:',
                    getTransactionLink(transactionId),
                )}
                {renderLine('Channel Id:', id)}
                {renderLine('Commit Fee:', getFormat(commitTransactionFee))}
                {renderLine(
                    'Commit Weight:',
                    getFormat(commitTransactionWeight),
                )}
                {renderLine('Is Static Remote Key:', isStaticRemoteKey)}
                {renderLine('Local Reserve:', getFormat(localReserve))}
                {renderLine('Remote Reserve:', getFormat(remoteReserve))}
                {renderLine('Time Offline:', timeOffline)}
                {renderLine('Time Online:', timeOnline)}
                {renderLine('Transaction Vout:', transactionVout)}
                {renderLine('Unsettled Balance:', unsettledBalance)}
                <Sub4Title>Partner Node Info</Sub4Title>
                {renderLine('Node Capacity:', getFormat(nodeCapacity))}
                {renderLine('Channel Count:', channelCount)}
                {renderLine(
                    'Last Update:',
                    `${getDateDif(lastUpdate)} ago (${getFormatDate(
                        lastUpdate,
                    )})`,
                )}
                <Separation />
                <CloseButton color={'red'} onClick={() => setModalOpen(true)}>
                    Close Channel
                </CloseButton>
            </>
        );
    };

    return (
        <SubCard color={nodeColor} key={index}>
            <MainInfo onClick={() => handleClick()}>
                <StatusLine>
                    {getStatusDot(isActive, 'active')}
                    {getStatusDot(isOpening, 'opening')}
                    {getStatusDot(isClosing, 'closing')}
                </StatusLine>
                <SingleLine>
                    <NodeTitle>{alias ? alias : 'Unknown'}</NodeTitle>
                    <SingleLine>
                        {formatBalance}
                        {getPrivate(isPrivate)}
                        {getSymbol(isPartnerInitiated)}
                        <div>
                            <Progress
                                data-tip
                                data-for={`node_balance_tip_${index}`}
                            >
                                <ProgressBar
                                    percent={getPercent(
                                        localBalance,
                                        remoteBalance,
                                    )}
                                />
                            </Progress>
                            <Progress
                                data-tip
                                data-for={`node_activity_tip_${index}`}
                            >
                                <ProgressBar
                                    order={2}
                                    percent={getPercent(received, sent)}
                                />
                            </Progress>
                        </div>
                    </SingleLine>
                </SingleLine>
            </MainInfo>
            {index === indexOpen && renderDetails()}
            <ReactTooltip
                id={`node_balance_tip_${index}`}
                effect={'solid'}
                place={'bottom'}
                type={tooltipType}
            >
                <div>{`Local Balance: ${formatLocal}`}</div>
                <div>{`Remote Balance: ${formatRemote}`}</div>
            </ReactTooltip>
            <ReactTooltip
                id={`node_activity_tip_${index}`}
                effect={'solid'}
                place={'bottom'}
                type={tooltipType}
            >
                <div>{`received: ${formatreceived}`}</div>
                <div>{`Sent: ${formatSent}`}</div>
            </ReactTooltip>
            <Modal isOpen={modalOpen} setIsOpen={setModalOpen}>
                <CloseChannel
                    setModalOpen={setModalOpen}
                    channelId={id}
                    channelName={alias}
                />
            </Modal>
        </SubCard>
    );
};
