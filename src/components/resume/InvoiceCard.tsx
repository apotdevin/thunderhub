import React from 'react';
import { getValue } from '../../helpers/Helpers';
import { useSettings } from '../../context/SettingsContext';
import {
    Separation,
    SubCard,
    SingleLine,
    DarkSubTitle,
} from '../generic/Styled';
import { StatusLine, NodeTitle, MainInfo } from '../channels/Channels.style';
import {
    getStatusDot,
    getDateDif,
    getFormatDate,
    renderLine,
} from '../generic/Helpers';
import { AddMargin } from './ResumeList';

interface InvoiceCardProps {
    invoice: any;
    index: number;
    setIndexOpen: (index: number) => void;
    indexOpen: number;
}

export const InvoiceCard = ({
    invoice,
    index,
    setIndexOpen,
    indexOpen,
}: InvoiceCardProps) => {
    const { price, symbol, currency } = useSettings();
    const priceProps = { price, symbol, currency };

    const getFormat = (amount: string) =>
        getValue({
            amount,
            ...priceProps,
        });

    const {
        date,
        confirmed_at,
        created_at,
        description,
        expires_at,
        is_confirmed,
        // received,
        tokens,
        chain_address,
        description_hash,
        id,
        is_canceled,
        is_held,
        is_outgoing,
        is_private,
        // payments,
        // received_mtokens,
        // request,
        secret,
    } = invoice;

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
                {is_confirmed &&
                    renderLine(
                        'Confirmed:',
                        `${getDateDif(confirmed_at)} ago (${getFormatDate(
                            confirmed_at,
                        )})`,
                    )}
                {renderLine(
                    'Created:',
                    `${getDateDif(created_at)} ago (${getFormatDate(
                        created_at,
                    )})`,
                )}
                {renderLine(
                    'Expires:',
                    `${getDateDif(expires_at)} ago (${getFormatDate(
                        expires_at,
                    )})`,
                )}
                {renderLine('Id:', id)}
                {renderLine('Chain Address:', chain_address)}
                {renderLine('Description Hash:', description_hash)}
                {renderLine('Is Canceled:', is_canceled)}
                {renderLine('Is Held:', is_held)}
                {renderLine('Is Outgoing:', is_outgoing)}
                {renderLine('Is Private:', is_private)}
                {renderLine('Secret:', secret)}
            </>
        );
    };

    return (
        <SubCard key={index}>
            <MainInfo onClick={() => handleClick()}>
                <StatusLine>{getStatusDot(is_confirmed, 'active')}</StatusLine>
                <SingleLine>
                    <SingleLine>
                        <NodeTitle>{description}</NodeTitle>
                        <AddMargin>
                            <DarkSubTitle>{`(${getDateDif(
                                date,
                            )} ago)`}</DarkSubTitle>
                        </AddMargin>
                    </SingleLine>
                    <SingleLine>{formatAmount}</SingleLine>
                </SingleLine>
            </MainInfo>
            {index === indexOpen && renderDetails()}
        </SubCard>
    );
};
