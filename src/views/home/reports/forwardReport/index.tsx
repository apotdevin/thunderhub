import React, { useState } from 'react';
import styled from 'styled-components';
import {
  CardWithTitle,
  SubTitle,
  Card,
  CardTitle,
  Separation,
} from '../../../../components/generic/Styled';
import { mediaWidths } from '../../../../styles/Themes';
import { ForwardReport, ReportDuration, ReportType } from './ForwardReport';
import { ForwardChannelsReport } from './ForwardChannelReport';
import { ButtonRow } from './Buttons';

export const CardContent = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column;
  padding: 0 16px;

  @media (${mediaWidths.mobile}) {
    padding: 0 8px;
  }
`;

export const ForwardBox = () => {
  const [isTime, setIsTime] = useState<ReportDuration>('month');
  const [isType, setIsType] = useState<ReportType>('amount');

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Forward Report</SubTitle>
      </CardTitle>
      <Card mobileCardPadding={'8px'}>
        <ButtonRow
          isTime={isTime}
          isType={isType}
          setIsTime={setIsTime}
          setIsType={setIsType}
        />
        <ForwardReport isTime={isTime} isType={isType} />
        <Separation />
        <ForwardChannelsReport isTime={isTime} isType={isType} />
      </Card>
    </CardWithTitle>
  );
};
