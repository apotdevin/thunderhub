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
    SingleLine,
    RightAlign,
} from '../../../components/generic/Styled';
import { useSettings } from '../../../context/SettingsContext';
import {
    getStatusDot,
    getTooltipType,
    getFormatDate,
    getDateDif,
    renderLine,
} from '../../../components/generic/Helpers';
import {
    getTransactionLink,
    getNodeLink,
} from '../../../components/generic/Helpers';
import Modal from '../../../components/modal/ReactModal';
import { CloseChannel } from '../../../components/closeChannel/CloseChannel';
import styled from 'styled-components';
import { AdminSwitch } from '../../../components/adminSwitch/AdminSwitch';
import { DownArrow, UpArrow, EyeOff } from '../../../components/generic/Icons';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';

const IconPadding = styled.div`
    margin-left: 16px;
    margin-right: 8px;
`;

const getSymbol = (status: boolean) => {
    return status ? <UpArrow /> : <DownArrow />;
};

const getPrivate = (status: boolean) => {
    return status && <EyeOff />;
};

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
        commit_transaction_fee,
        commit_transaction_weight,
        id,
        is_active,
        is_closing,
        is_opening,
        is_partner_initiated,
        is_private,
        is_static_remote_key,
        local_balance,
        local_reserve,
        partner_public_key,
        received,
        remote_balance,
        remote_reserve,
        sent,
        time_offline,
        time_online,
        transaction_id,
        transaction_vout,
        unsettled_balance,
        partner_node_info,
    } = channelInfo;

    const {
        alias,
        capacity: nodeCapacity,
        channel_count,
        color: nodeColor,
        updated_at,
    } = partner_node_info;

    const formatBalance = getFormat(capacity);
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
                {renderLine(
                    'Node Public Key:',
                    getNodeLink(partner_public_key),
                )}
                {renderLine(
                    'Transaction Id:',
                    getTransactionLink(transaction_id),
                )}
                {renderLine('Channel Id:', id)}
                {renderLine('Commit Fee:', getFormat(commit_transaction_fee))}
                {renderLine(
                    'Commit Weight:',
                    getFormat(commit_transaction_weight),
                )}
                {renderLine('Is Static Remote Key:', is_static_remote_key)}
                {renderLine('Local Reserve:', getFormat(local_reserve))}
                {renderLine('Remote Reserve:', getFormat(remote_reserve))}
                {renderLine('Time Offline:', time_offline)}
                {renderLine('Time Online:', time_online)}
                {renderLine('Transaction Vout:', transaction_vout)}
                {renderLine('Unsettled Balance:', unsettled_balance)}
                <Sub4Title>Partner Node Info</Sub4Title>
                {renderLine('Node Capacity:', getFormat(nodeCapacity))}
                {renderLine('Channel Count:', channel_count)}
                {renderLine(
                    'Last Update:',
                    `${getDateDif(updated_at)} ago (${getFormatDate(
                        updated_at,
                    )})`,
                )}
                <AdminSwitch>
                    <Separation />
                    <RightAlign>
                        <ColorButton
                            withBorder={true}
                            // color={'red'}
                            arrow={true}
                            onClick={() => setModalOpen(true)}
                        >
                            Close Channel
                        </ColorButton>
                    </RightAlign>
                </AdminSwitch>
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
                <SingleLine>
                    <NodeTitle>{alias ? alias : 'Unknown'}</NodeTitle>
                    <SingleLine>
                        {formatBalance}
                        <IconPadding>
                            {getPrivate(is_private)}
                            {getSymbol(is_partner_initiated)}
                        </IconPadding>
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
