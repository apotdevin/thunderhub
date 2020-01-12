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
        close_transaction_id,
        is_active,
        is_closing,
        is_opening,
        local_balance,
        // local_reserve,
        partner_public_key,
        received,
        remote_balance,
        // remote_reserve,
        sent,
        transaction_fee,
        transaction_id,
        // transaction_vout,
        partner_node_info,
    } = channelInfo;

    const { alias, color: nodeColor } = partner_node_info;

    const formatBalance = getFormat(local_balance + remote_balance);
    const formatLocal = getFormat(local_balance);
    const formatRemote = getFormat(remote_balance);
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
                    {getNodeLink(partner_public_key)}
                </DetailLine>
                <DetailLine>
                    <div>Transaction Id:</div>
                    {getTransactionLink(transaction_id)}
                </DetailLine>
                <DetailLine>
                    <div>Transaction Fee:</div>
                    {getTransactionLink(transaction_fee)}
                </DetailLine>
                <DetailLine>
                    <div>Close Transaction Id:</div>
                    {getTransactionLink(close_transaction_id)}
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
                {getStatusDot(is_active, 'active')}
                {getStatusDot(is_opening, 'opening')}
                {getStatusDot(is_closing, 'closing')}
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
                                    local_balance,
                                    remote_balance,
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
