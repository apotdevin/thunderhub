import React, { useState } from 'react';
import {
    CardWithTitle,
    SubTitle,
    Card,
    CardTitle,
    ColorButton,
} from '../generic/Styled';
import styled from 'styled-components';
import { Zap, XSvg, Layers, Anchor } from '../generic/Icons';
import { unSelectedNavButton } from '../../styles/Themes';
import { CreateInvoiceCard } from './createInvoice/CreateInvoice';
import { PayCard } from './pay/pay';
import { DecodeCard } from './decode/Decode';
import { SendOnChainCard } from './sendOnChain/SendOnChain';
import { ReceiveOnChainCard } from './receiveOnChain/ReceiveOnChain';

const sectionColor = '#69c0ff';

const QuickCard = styled(Card)`
    height: 100px;
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 25px;
    padding: 10px;
    margin-right: 10px;
    cursor: pointer;

    &:hover {
        border: 1px solid ${sectionColor};
    }
`;

const QuickTitle = styled.div`
    font-size: 14px;
    color: ${unSelectedNavButton};
    margin-top: 10px;
`;

const QuickRow = styled.div`
    display: flex;
`;

export const QuickActions = () => {
    const [openCard, setOpenCard] = useState('none');

    const getTitle = () => {
        switch (openCard) {
            case 'send_ln':
                return 'Send Sats over Lightning';
            case 'receive_ln':
                return 'Receive Sats over Lightning';
            case 'decode':
                return 'Decode a Lightning Request';
            case 'send_chain':
                return 'Send To On Chain Address';
            case 'receive_chain':
                return 'Create Address to Receive';
            default:
                return 'Quick Actions';
        }
    };

    const renderContent = () => {
        switch (openCard) {
            case 'send_ln':
                return <PayCard color={sectionColor} />;
            case 'receive_ln':
                return <CreateInvoiceCard color={sectionColor} />;
            case 'decode':
                return <DecodeCard color={sectionColor} />;
            case 'send_chain':
                return <SendOnChainCard color={sectionColor} />;
            case 'receive_chain':
                return <ReceiveOnChainCard color={sectionColor} />;
            default:
                return (
                    <QuickRow>
                        <QuickCard onClick={() => setOpenCard('send_ln')}>
                            <Zap size={'24px'} color={sectionColor} />
                            <QuickTitle>Send</QuickTitle>
                        </QuickCard>
                        <QuickCard onClick={() => setOpenCard('receive_ln')}>
                            <Zap size={'24px'} color={sectionColor} />
                            <QuickTitle>Receive</QuickTitle>
                        </QuickCard>
                        <QuickCard onClick={() => setOpenCard('decode')}>
                            <Layers size={'24px'} color={sectionColor} />
                            <QuickTitle>Decode</QuickTitle>
                        </QuickCard>
                        <QuickCard onClick={() => setOpenCard('send_chain')}>
                            <Anchor size={'24px'} color={sectionColor} />
                            <QuickTitle>Send</QuickTitle>
                        </QuickCard>
                        <QuickCard onClick={() => setOpenCard('receive_chain')}>
                            <Anchor size={'24px'} color={sectionColor} />
                            <QuickTitle>Receive</QuickTitle>
                        </QuickCard>
                    </QuickRow>
                );
        }
    };

    return (
        <CardWithTitle>
            <CardTitle>
                <SubTitle>{getTitle()}</SubTitle>
                {openCard !== 'none' && (
                    <ColorButton
                        onClick={() => setOpenCard('none')}
                        color={sectionColor}
                    >
                        <XSvg />
                    </ColorButton>
                )}
            </CardTitle>
            {renderContent()}
        </CardWithTitle>
    );
};
