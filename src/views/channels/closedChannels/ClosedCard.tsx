import React from 'react';
import { getValue } from '../../../helpers/Helpers';
import { NodeTitle, DetailLine, MainInfo } from '../Channels.style';
import {
    SubCard,
    Separation,
    SingleLine,
    DarkSubTitle,
} from '../../../components/generic/Styled';
import { useSettings } from '../../../context/SettingsContext';
import { getTransactionLink } from '../../../components/generic/Helpers';
import { getNodeLink } from '../../../components/generic/Helpers';
import styled from 'styled-components';

const Padding = styled.div`
    padding-left: 8px;
`;

interface PendingCardProps {
    channelInfo: any;
    index: number;
    setIndexOpen: (index: number) => void;
    indexOpen: number;
}

export const ClosedCard = ({
    channelInfo,
    index,
    setIndexOpen,
    indexOpen,
}: PendingCardProps) => {
    const { price, symbol, currency } = useSettings();
    const priceProps = { price, symbol, currency };

    const getFormat = (amount: string) =>
        getValue({
            amount,
            ...priceProps,
        });

    const {
        capacity,
        close_confirm_height,
        close_transaction_id,
        final_local_balance,
        final_time_locked_balance,
        id,
        is_breach_close,
        is_cooperative_close,
        is_funding_cancel,
        is_local_force_close,
        is_remote_force_close,
        partner_public_key,
        transaction_id,
        transaction_vout,
        partner_node_info,
    } = channelInfo;

    const { alias, color: nodeColor } = partner_node_info;

    const formatCapacity = getFormat(capacity);

    const getCloseType = (): string => {
        let types: string[] = [];

        if (is_breach_close) {
            types.push('Breach');
        }
        if (is_cooperative_close) {
            types.push('Cooperative');
        }
        if (is_funding_cancel) {
            types.push('Funding Cancel');
        }
        if (is_local_force_close) {
            types.push('Local Force Close');
        }
        if (is_remote_force_close) {
            types.push('Remote Force Close');
        }

        return types.join(', ');
    };

    console.log(getCloseType());

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
                    <div>Channel Id:</div>
                    {id}
                </DetailLine>
                <DetailLine>
                    <div>Node Public Key:</div>
                    {getNodeLink(partner_public_key)}
                </DetailLine>
                <DetailLine>
                    <div>Transaction Id:</div>
                    {getTransactionLink(transaction_id)}
                </DetailLine>
                <DetailLine>
                    <div>Transaction Vout:</div>
                    {transaction_vout}
                </DetailLine>
                <DetailLine>
                    <div>Close Transaction Id:</div>
                    {getTransactionLink(close_transaction_id)}
                </DetailLine>
                <DetailLine>
                    <div>Close Confirm Height:</div>
                    {close_confirm_height}
                </DetailLine>
                <DetailLine>
                    <div>Final Local Balance:</div>
                    {final_local_balance}
                </DetailLine>
                <DetailLine>
                    <div>Final Time Lock Balance:</div>
                    {final_time_locked_balance}
                </DetailLine>
            </>
        );
    };

    return (
        <SubCard color={nodeColor} key={index}>
            <MainInfo onClick={() => handleClick()}>
                <SingleLine>
                    <NodeTitle>{alias ? alias : 'Unknown'}</NodeTitle>
                    {formatCapacity}
                    <SingleLine>
                        <DarkSubTitle>Close Type:</DarkSubTitle>
                        <Padding>{getCloseType()}</Padding>
                    </SingleLine>
                </SingleLine>
            </MainInfo>
            {index === indexOpen && renderDetails()}
        </SubCard>
    );
};
