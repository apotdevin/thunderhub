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
import { ForwardReport, ReportType } from './ForwardReport';
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
  const [days, setDays] = useState<number>(30);
  const [order, setOrder] = useState<ReportType>('amount');

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Forward Report</SubTitle>
      </CardTitle>
      <Card mobileCardPadding={'8px'}>
        <ButtonRow
          days={days}
          order={order}
          setDays={setDays}
          setOrder={setOrder}
        />
        <ForwardReport days={days} order={order} />
        <Separation />
        <ForwardChannelsReport days={days} order={order} />
      </Card>
    </CardWithTitle>
  );
};
