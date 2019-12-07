import React, { useContext, useState } from 'react';
import { getPercent, getValue } from '../../../helpers/Helpers';
import {
    Progress,
    ProgressBar,
    NodeTitle,
    NodeBar,
    NodeDetails,
    StatusLine,
    DetailLine,
    MainInfo,
} from '../Channels.style';
import ReactTooltip from 'react-tooltip';
import { SubCard, Separation } from '../../generic/Styled';
import { SettingsContext } from '../../../context/SettingsContext';
import {
    getStatusDot,
    getPrivate,
    getSymbol,
    getTooltipType,
} from '../../generic/Helpers';
import { getTransactionLink, getNodeLink } from '../../generic/Helpers';
import Modal from '../../modal/ReactModal';
import { CloseChannel } from '../../closeChannel/CloseChannel';

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

    const { price, symbol, currency, theme } = useContext(SettingsContext);
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
        // commitTransactionWeight,
        id,
        isActive,
        isClosing,
        isOpening,
        isPartnerInitiated,
        isPrivate,
        // isStaticRemoteKey,
        localBalance,
        // localReserve,
        partnerPublicKey,
        received,
        remoteBalance,
        // remoteReserve,
        sent,
        // timeOffline,
        // timeOnline,
        transactionId,
        // transactionVout,
        // unsettledBalance,
        partnerNodeInfo,
    } = channelInfo;

    const {
        alias,
        // capacity: nodeCapacity,
        // channelCount,
        color: nodeColor,
        // lastUpdate
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
                <DetailLine>
                    <div>Node Public Key:</div>
                    {getNodeLink(partnerPublicKey)}
                </DetailLine>
                <DetailLine>
                    <div>Transaction Id:</div>
                    {getTransactionLink(transactionId)}
                </DetailLine>
                <DetailLine>
                    <div>Channel Id:</div>
                    {id}
                </DetailLine>
                <DetailLine>
                    <div>Commit Fee:</div>
                    {getFormat(commitTransactionFee)}
                </DetailLine>
                {/* <div>{commitTransactionWeight}</div> */}
                {/* <div>{isStaticRemoteKey}</div> */}
                {/* <div>{localReserve}</div> */}
                {/* <div>{remoteReserve}</div> */}
                {/* <div>{timeOffline}</div> */}
                {/* <div>{timeOnline}</div> */}
                {/* <div>{transactionVout}</div> */}
                {/* <div>{unsettledBalance}</div> */}
                {/* <div>{nodeCapacity}</div> */}
                {/* <div>{channelCount}</div> */}
                {/* <div>{lastUpdate}</div> */}
                <Separation />
                <button onClick={() => setModalOpen(true)}>
                    Close Channel
                </button>
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
                <NodeBar>
                    <NodeTitle>{alias ? alias : 'Unknown'}</NodeTitle>
                    <NodeDetails>
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
                    </NodeDetails>
                </NodeBar>
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
