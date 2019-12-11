import React, { useState } from 'react';
import { ForwardReport } from '../forwardReport/ForwardReport';
import { ForwardChannelsReport } from '../forwardReport/ForwardChannelReport';
import styled from 'styled-components';
import { CardWithTitle, SubTitle, Card, CardTitle } from '../../generic/Styled';
import { ButtonRow } from './Buttons';

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
const availableTypes = ['amount', 'fee', 'tokens'];
const mappedTypes = ['Amount', 'Fees', 'Value'];
const buttonBorder = `#6938f1`;

export const ForwardBox = () => {
    const [isTime, setIsTime] = useState<string>('week');
    const [isType, setIsType] = useState<string>('amount');

    const props = { isTime, isType, color: buttonBorder };

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
                <SubTitle>Foward Report</SubTitle>
                <ButtonRow {...buttonProps} />
            </CardTitle>
            <Card>
                <Row>
                    <ForwardReport {...props} />
                    <ForwardChannelsReport {...props} />
                </Row>
            </Card>
        </CardWithTitle>
    );
};
