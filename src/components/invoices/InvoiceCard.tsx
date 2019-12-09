import React, { useContext } from 'react';
import { getValue } from '../../helpers/Helpers';
import { SettingsContext } from '../../context/SettingsContext';
import { Separation, SubCard } from '../generic/Styled';
import {
    StatusLine,
    NodeBar,
    NodeTitle,
    NodeDetails,
} from '../channels/Channels.style';
import {
    getStatusDot,
    getDateDif,
    getFormatDate,
    renderLine,
} from '../generic/Helpers';
import styled from 'styled-components';

interface InvoiceCardProps {
    invoice: any;
    index: number;
    setIndexOpen: (index: number) => void;
    indexOpen: number;
}

const DifLine = styled.div`
    font-size: 12px;
    color: #bfbfbf;
`;

const formatDifference = (
    difference: string,
    numDif: number,
    status: boolean,
) => {
    if (numDif > 0) {
        return `+ ${difference}`;
    } else if (numDif < 0 && status) {
        return `- ${difference}`;
    } else {
        return null;
    }
};

export const InvoiceCard = ({
    invoice,
    index,
    setIndexOpen,
    indexOpen,
}: InvoiceCardProps) => {
    const { price, symbol, currency } = useContext(SettingsContext);
    const priceProps = { price, symbol, currency };

    const getFormat = (amount: string) =>
        getValue({
            amount,
            ...priceProps,
        });

    const {
        confirmedAt,
        createdAt,
        description,
        expiresAt,
        isConfirmed,
        received,
        tokens,
        chainAddress,
        descriptionHash,
        id,
        isCanceled,
        isHeld,
        isOutgoing,
        isPrivate,
        // payments,
        // receivedMtokens,
        // request,
        secret,
    } = invoice;

    const formatAmount = getFormat(tokens);
    const dif = received - tokens;
    const formatDif = getFormat(`${dif}`);

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
                {isConfirmed &&
                    renderLine(
                        'Confirmed:',
                        `${getDateDif(confirmedAt)} ago (${getFormatDate(
                            confirmedAt,
                        )})`,
                    )}
                {renderLine(
                    'Created:',
                    `${getDateDif(createdAt)} ago (${getFormatDate(
                        createdAt,
                    )})`,
                )}
                {renderLine(
                    'Expires:',
                    `${getDateDif(expiresAt)} ago (${getFormatDate(
                        expiresAt,
                    )})`,
                )}
                {renderLine('Id:', id)}
                {renderLine('Chain Address:', chainAddress)}
                {renderLine('Description Hash:', descriptionHash)}
                {renderLine('Is Canceled:', isCanceled)}
                {renderLine('Is Held:', isHeld)}
                {renderLine('Is Outgoing:', isOutgoing)}
                {renderLine('Is Private:', isPrivate)}
                {renderLine('Secret:', secret)}
            </>
        );
    };

    return (
        <SubCard key={index} onClick={() => handleClick()}>
            <StatusLine>{getStatusDot(isConfirmed, 'active')}</StatusLine>
            <NodeBar>
                <NodeTitle>
                    {formatAmount}
                    <DifLine>
                        {formatDifference(formatDif, dif, isConfirmed)}
                    </DifLine>
                </NodeTitle>
                <NodeDetails>{description}</NodeDetails>
            </NodeBar>
            {index === indexOpen && renderDetails()}
        </SubCard>
    );
};
