import React from 'react';
import { getValue } from '../../helpers/Helpers';
import { useSettings } from '../../context/SettingsContext';
import {
    Separation,
    SubCard,
    DarkSubTitle,
    ResponsiveLine,
} from '../../components/generic/Styled';
import { StatusLine, NodeTitle, MainInfo } from '../channels/Channels.style';
import {
    getStatusDot,
    getDateDif,
    getFormatDate,
    getNodeLink,
    renderLine,
} from '../../components/generic/Helpers';
import styled from 'styled-components';

interface PaymentsCardProps {
    payment: any;
    index: number;
    setIndexOpen: (index: number) => void;
    indexOpen: number;
}

const RedValue = styled.div`
    color: red;
`;

export const PaymentsCard = ({
    payment,
    index,
    setIndexOpen,
    indexOpen,
}: PaymentsCardProps) => {
    const { price, symbol, currency } = useSettings();
    const priceProps = { price, symbol, currency };

    const getFormat = (amount: string) =>
        getValue({
            amount,
            ...priceProps,
        });

    const {
        alias,
        date,
        created_at,
        destination,
        fee,
        fee_mtokens,
        hops,
        is_confirmed,
        tokens,
        id,
        is_outgoing,
        mtokens,
        secret,
    } = payment;

    const formatAmount = getFormat(tokens);

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
                    'Created:',
                    `${getDateDif(created_at)} ago (${getFormatDate(
                        created_at,
                    )})`,
                )}
                {renderLine('Destination Node:', getNodeLink(destination))}
                {renderLine('Fee:', getFormat(fee))}
                {renderLine('Fee msats:', `${fee_mtokens} millisats`)}
                {renderLine('Hops:', hops.length)}
                {hops.map((hop: any, index: number) =>
                    renderLine(`Hop ${index + 1}:`, hop),
                )}
                {renderLine('Id:', id)}
                {renderLine('Is Outgoing:', is_outgoing ? 'true' : 'false')}
                {renderLine('Secret:', secret)}
                {renderLine('M Tokens:', `${mtokens} millisats`)}
            </>
        );
    };

    return (
        <SubCard key={index}>
            <MainInfo onClick={() => handleClick()}>
                <StatusLine>{getStatusDot(is_confirmed, 'active')}</StatusLine>
                <ResponsiveLine>
                    <NodeTitle>{`Payment to: ${alias}`}</NodeTitle>
                    <DarkSubTitle>{`(${getDateDif(date)} ago)`}</DarkSubTitle>
                    <RedValue>{formatAmount}</RedValue>
                </ResponsiveLine>
            </MainInfo>
            {index === indexOpen && renderDetails()}
        </SubCard>
    );
};
