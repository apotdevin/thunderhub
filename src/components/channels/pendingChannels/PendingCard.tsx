import React from 'react';
import { getPercent, getValue } from '../../../helpers/Helpers';
import {
    Progress,
    ProgressBar,
    NodeTitle,
    StatusLine,
    DetailLine,
} from '../Channels.style';
import ReactTooltip from 'react-tooltip';
import { SubCard, Separation, SingleLine } from '../../generic/Styled';
import { useSettings } from '../../../context/SettingsContext';
import {
    getStatusDot,
    getTooltipType,
    getTransactionLink,
} from '../../generic/Helpers';
import { getNodeLink } from '../../generic/Helpers';

interface PendingCardProps {
    channelInfo: any;
    index: number;
    setIndexOpen: (index: number) => void;
    indexOpen: number;
}

export const PendingCard = ({
    channelInfo,
    index,
    setIndexOpen,
    indexOpen,
}: PendingCardProps) => {
    const { price, symbol, currency, theme } = useSettings();
    const priceProps = { price, symbol, currency };

    const tooltipType = getTooltipType(theme);

    const getFormat = (amount: string) =>
        getValue({
            amount,
            ...priceProps,
        });

    const {
        closeTransactionId,
        isActive,
        isClosing,
        isOpening,
        localBalance,
        // localReserve,
        partnerPublicKey,
        received,
        remoteBalance,
        // remoteReserve,
        sent,
        transactionFee,
        transactionId,
        // transactionVout,
        partnerNodeInfo,
    } = channelInfo;

    const {
        alias,
        // capacity: nodeCapacity,
        // channelCount,
        color: nodeColor,
        // lastUpdate
    } = partnerNodeInfo;

    const formatBalance = getFormat(localBalance + remoteBalance);
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
                    <div>Transaction Fee:</div>
                    {getTransactionLink(transactionFee)}
                </DetailLine>
                <DetailLine>
                    <div>Close Transaction Id:</div>
                    {getTransactionLink(closeTransactionId)}
                </DetailLine>
                {/* <DetailLine>{localReserve}</DetailLine> */}
                {/* <DetailLine>{remoteReserve}</DetailLine> */}
                {/* <DetailLine>{nodeCapacity}</DetailLine> */}
                {/* <DetailLine>{channelCount}</DetailLine> */}
                {/* <DetailLine>{lastUpdate}</DetailLine> */}
            </>
        );
    };

    return (
        <SubCard color={nodeColor} key={index} onClick={() => handleClick()}>
            <StatusLine>
                {getStatusDot(isActive, 'active')}
                {getStatusDot(isOpening, 'opening')}
                {getStatusDot(isClosing, 'closing')}
            </StatusLine>
            <SingleLine>
                <NodeTitle>{alias ? alias : 'Unknown'}</NodeTitle>
                <SingleLine>
                    {formatBalance}
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
        </SubCard>
    );
};
