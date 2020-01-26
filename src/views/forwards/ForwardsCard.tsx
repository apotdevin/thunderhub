import React from 'react';
import { getValue } from '../../helpers/Helpers';
import { useSettings } from '../../context/SettingsContext';
import {
    Separation,
    SubCard,
    ColumnLine,
    ResponsiveLine,
    ResponsiveSingle,
} from '../../components/generic/Styled';
import { MainInfo } from '../channels/Channels.style';
import {
    getDateDif,
    getFormatDate,
    renderLine,
} from '../../components/generic/Helpers';

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
                <ResponsiveLine>
                    <ResponsiveSingle>
                        <ColumnLine>
                            {renderLine('Incoming:', incoming_alias)}
                            {renderLine('Outgoing:', outgoing_alias)}
                        </ColumnLine>
                    </ResponsiveSingle>
                    <ColumnLine>
                        {renderLine('Amount:', formatAmount)}
                        {renderLine('Fee:', formatFee)}
                        {renderLine('Date:', `${getDateDif(created_at)} ago`)}
                    </ColumnLine>
                </ResponsiveLine>
            </MainInfo>
            {index === indexOpen && renderDetails()}
        </SubCard>
    );
};
