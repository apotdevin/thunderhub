import React from 'react';
import { getValue } from '../../helpers/Helpers';
import { useSettings } from '../../context/SettingsContext';
import {
    Separation,
    SubCard,
    SingleLine,
    ColumnLine,
    DarkSubTitle,
} from '../../components/generic/Styled';
import { MainInfo } from '../channels/Channels.style';
import {
    getDateDif,
    getFormatDate,
    renderLine,
} from '../../components/generic/Helpers';
import styled from 'styled-components';

const AddMargin = styled.div`
    margin-left: 16px;
`;

const StyledDark = styled(DarkSubTitle)`
    margin-right: 8px;
`;

interface ForwardCardProps {
    forward: any;
    index: number;
    setIndexOpen: (index: number) => void;
    indexOpen: number;
}

export const ForwardCard = ({
    forward,
    index,
    setIndexOpen,
    indexOpen,
}: ForwardCardProps) => {
    const { price, symbol, currency } = useSettings();
    const priceProps = { price, symbol, currency };

    const getFormat = (amount: string) =>
        getValue({
            amount,
            ...priceProps,
        });

    const {
        created_at,
        fee,
        fee_mtokens,
        incoming_channel,
        incoming_alias,
        outgoing_channel,
        outgoing_alias,
        tokens,
    } = forward;

    const formatAmount = getFormat(tokens);
    const formatFee = getFormat(fee);

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
                {renderLine('Incoming Channel: ', incoming_channel)}
                {renderLine('Outgoing Channel: ', outgoing_channel)}
                {renderLine('Fee MilliTokens: ', fee_mtokens)}
                {renderLine('Date: ', getFormatDate(created_at))}
            </>
        );
    };

    return (
        <SubCard key={index}>
            <MainInfo onClick={() => handleClick()}>
                <SingleLine>
                    <ColumnLine>
                        <SingleLine>
                            <StyledDark>Incoming:</StyledDark>
                            {incoming_alias}
                        </SingleLine>
                        <SingleLine>
                            <StyledDark>Outgoing:</StyledDark>
                            {outgoing_alias}
                        </SingleLine>
                    </ColumnLine>
                    <SingleLine>
                        <ColumnLine>
                            <SingleLine>
                                <StyledDark>Amount:</StyledDark>
                                {formatAmount}
                            </SingleLine>
                            <SingleLine>
                                <StyledDark>Fee:</StyledDark>
                                {formatFee}
                            </SingleLine>
                        </ColumnLine>
                    </SingleLine>
                    <AddMargin>
                        <DarkSubTitle>{`(${getDateDif(
                            created_at,
                        )} ago)`}</DarkSubTitle>
                    </AddMargin>
                </SingleLine>
            </MainInfo>
            {index === indexOpen && renderDetails()}
        </SubCard>
    );
};
