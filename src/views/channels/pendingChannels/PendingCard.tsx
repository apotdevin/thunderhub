import React from 'react';
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
    ResponsiveLine,
    ResponsiveSingle,
    ResponsiveCol,
} from '../../../components/generic/Styled';
import { useSettings } from '../../../context/SettingsContext';
import {
    getStatusDot,
    getTooltipType,
    getTransactionLink,
    renderLine,
    getDateDif,
    getFormatDate,
} from '../../../components/generic/Helpers';
import { getNodeLink } from '../../../components/generic/Helpers';

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
        local_reserve,
        partner_public_key,
        received,
        remote_balance,
        remote_reserve,
        sent,
        transaction_fee,
        transaction_id,
        transaction_vout,
        partner_node_info,
    } = channelInfo;

    const {
        alias,
        capacity,
        channelCount,
        color: nodeColor,
        updated_at,
    } = partner_node_info;

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
                {renderLine('State:', is_active ? 'Active' : 'Inactive')}
                {renderLine('Status:', is_opening ? 'Opening' : 'Closing')}
                {renderLine('Local Balance:', local_balance)}
                {renderLine('Remote Balance:', remote_balance)}
                {renderLine(
                    'Node Public Key:',
                    getNodeLink(partner_public_key),
                )}
                {renderLine(
                    'Transaction Id:',
                    getTransactionLink(transaction_id),
                )}
                {renderLine('Transaction Vout:', transaction_vout)}
                {renderLine(
                    'Transaction Fee:',
                    getTransactionLink(transaction_fee),
                )}
                {renderLine(
                    'Close Transaction Id:',
                    getTransactionLink(close_transaction_id),
                )}
                {renderLine('Local Reserve:', local_reserve)}
                {renderLine('Remote Reserve:', remote_reserve)}
                <Sub4Title>Partner Node Info</Sub4Title>
                {renderLine('Node Capacity:', capacity)}
                {renderLine('Channels:', channelCount)}
                {renderLine(
                    'Last Update:',
                    `${getDateDif(updated_at)} ago (${getFormatDate(
                        updated_at,
                    )})`,
                )}
            </>
        );
    };

    return (
        <SubCard color={nodeColor} key={index}>
            <MainInfo onClick={() => handleClick()}>
                <StatusLine>
                    {getStatusDot(is_active, 'active')}
                    {getStatusDot(is_opening, 'opening')}
                    {getStatusDot(is_closing, 'closing')}
                </StatusLine>
                <ResponsiveLine>
                    <NodeTitle>{alias ? alias : 'Unknown'}</NodeTitle>
                    <ResponsiveSingle>
                        {formatBalance}
                        <ResponsiveCol>
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
                        </ResponsiveCol>
                    </ResponsiveSingle>
                </ResponsiveLine>
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
        </SubCard>
    );
};
