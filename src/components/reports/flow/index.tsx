import React, { useState } from 'react';
import styled from 'styled-components';
import { CardWithTitle, SubTitle, Card, CardTitle } from '../../generic/Styled';
import { ButtonRow } from '../forwardReport/Buttons';
import { FlowReport } from './FlowReport';

export const CardContent = styled.div`
    height: 100%;
    display: flex;
    flex-flow: column;
    width: 50%;
    padding: 0 20px;
`;

export const ChannelRow = styled.div`
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Row = styled.div`
    display: flex;
`;

const availableTimes = ['day', 'week', 'month'];
const mappedTimes = ['Day', 'Week', 'Month'];
const availableTypes = ['amount', 'tokens'];
const mappedTypes = ['Amount', 'Value'];
const buttonBorder = `#FD5F00`;

export const FlowBox = () => {
    const [isTime, setIsTime] = useState<string>('week');
    const [isType, setIsType] = useState<string>('amount');

    const props = { isTime, isType };
    const buttonProps = {
        isTime,
        isType,
        setIsTime,
        setIsType,
        availableTimes,
        availableTypes,
        mappedTimes,
        mappedTypes,
        buttonBorder,
    };

    return (
        <CardWithTitle>
            <CardTitle>
                <SubTitle>Flow</SubTitle>
                <ButtonRow {...buttonProps} />
            </CardTitle>
            <Card>
                <FlowReport {...props} />
            </Card>
        </CardWithTitle>
    );
};
