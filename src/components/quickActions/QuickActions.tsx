import React, { useState } from 'react';
import {
    CardWithTitle,
    SubTitle,
    Card,
    CardTitle,
    ColorButton,
} from '../generic/Styled';
import styled from 'styled-components';
import { XSvg, Layers } from '../generic/Icons';
import { unSelectedNavButton } from '../../styles/Themes';
import { DecodeCard } from './decode/Decode';

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
            case 'decode':
                return 'Decode a Lightning Request';
            default:
                return 'Quick Actions';
        }
    };

    const renderContent = () => {
        switch (openCard) {
            case 'decode':
                return <DecodeCard color={sectionColor} />;
            default:
                return (
                    <QuickRow>
                        <QuickCard onClick={() => setOpenCard('decode')}>
                            <Layers size={'24px'} color={sectionColor} />
                            <QuickTitle>Decode</QuickTitle>
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
