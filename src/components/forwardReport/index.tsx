import React, { useState } from 'react';
import { ForwardReport } from '../forwardReport/ForwardReport';
import { ForwardChannelsReport } from '../forwardReport/ForwardChannelReport';
import styled from 'styled-components';
import { CardWithTitle, SubTitle, Card, CardTitle } from '../generic/Styled';
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

export const ForwardBox = () => {
    const [isTime, setIsTime] = useState<string>('week');
    const [isType, setIsType] = useState<string>('amount');

    const props = { isTime, isType };

    return (
        <CardWithTitle>
            <CardTitle>
                <SubTitle>Foward Report</SubTitle>
                <ButtonRow
                    isTime={isTime}
                    isType={isType}
                    setIsTime={setIsTime}
                    setIsType={setIsType}
                />
            </CardTitle>
            <Card bottom={'25px'}>
                <Row>
                    <ForwardReport {...props} />
                    <ForwardChannelsReport {...props} />
                </Row>
            </Card>
        </CardWithTitle>
    );
};
