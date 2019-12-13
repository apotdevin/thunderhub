import React, { useContext } from 'react';
import { getValue } from '../../helpers/Helpers';
import { SettingsContext } from '../../context/SettingsContext';
import {
    Separation,
    SubCard,
    DarkSubTitle,
    SingleLine,
} from '../generic/Styled';
import {
    DetailLine,
    StatusLine,
    NodeTitle,
    MainInfo,
} from '../channels/Channels.style';
import {
    getStatusDot,
    getDateDif,
    getFormatDate,
    getNodeLink,
} from '../generic/Helpers';
import styled from 'styled-components';
import { AddMargin } from './ResumeList';

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
    const { price, symbol, currency } = useContext(SettingsContext);
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
                <DetailLine>
                    <div>Created:</div>
                    {`${getDateDif(created_at)} ago (${getFormatDate(
                        created_at,
                    )})`}
                </DetailLine>
                <DetailLine>
                    <div>Destination Node:</div>
                    {getNodeLink(destination)}
                </DetailLine>
                <DetailLine>
                    <div>Fee:</div>
                    {getFormat(fee)}
                </DetailLine>
                <DetailLine>
                    <div>Fee msats:</div>
                    {`${fee_mtokens} sats`}
                </DetailLine>
                <DetailLine>
                    <div>Hops:</div>
                    {hops.length}
                </DetailLine>
                {hops.map((hop: any, index: number) => (
                    <DetailLine>
                        <div>{`Hop ${index + 1}:`}</div>
                        <div style={{ textAlign: 'right' }} key={index}>
                            {hop}
                        </div>
                    </DetailLine>
                ))}
                <DetailLine>
                    <div>ID:</div>
                    {id}
                </DetailLine>
                <DetailLine>
                    <div>Is Outgoing:</div>
                    {is_outgoing ? 'true' : 'false'}
                </DetailLine>
                <DetailLine>
                    <div>Secret:</div>
                    {secret}
                </DetailLine>
                <DetailLine>
                    <div>M Tokens:</div>
                    {mtokens}
                </DetailLine>
            </>
        );
    };

    return (
        <SubCard key={index}>
            <MainInfo onClick={() => handleClick()}>
                <StatusLine>{getStatusDot(is_confirmed, 'active')}</StatusLine>
                <SingleLine>
                    <SingleLine>
                        <NodeTitle>{`Payment to: ${alias}`}</NodeTitle>
                        <AddMargin>
                            <DarkSubTitle>{`(${getDateDif(
                                date,
                            )} ago)`}</DarkSubTitle>
                        </AddMargin>
                    </SingleLine>
                    <RedValue>{formatAmount}</RedValue>
                </SingleLine>
            </MainInfo>
            {index === indexOpen && renderDetails()}
        </SubCard>
    );
};
