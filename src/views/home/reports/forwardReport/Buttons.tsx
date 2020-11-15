import React from 'react';
import {
  SingleButton,
  MultiButton,
} from 'src/components/buttons/multiButton/MultiButton';
import { ResponsiveSingle } from 'src/components/generic/Styled';
import { ReportType, ReportDuration, FlowReportType } from './ForwardReport';

interface ButtonProps {
  days: number;
  order: ReportType;
  setDays: (days: number) => void;
  setOrder: (text: ReportType) => void;
}

export const ButtonRow: React.FC<ButtonProps> = ({
  days,
  setDays,
  order,
  setOrder,
}) => {
  const timeButton = (title: string, buttonDays: number) => (
    <SingleButton
      withPadding={'4px 8px'}
      onClick={() => setDays(buttonDays)}
      selected={days === buttonDays}
    >
      {title}
    </SingleButton>
  );

  const typeButton = (type: ReportType, title: string) => (
    <SingleButton
      withPadding={'4px 8px'}
      onClick={() => setOrder(type)}
      selected={order === type}
    >
      {title}
    </SingleButton>
  );

  return (
    <ResponsiveSingle>
      <MultiButton>
        {timeButton('1D', 1)}
        {timeButton('1W', 7)}
        {timeButton('1M', 30)}
        {timeButton('3M', 90)}
        {timeButton('6M', 180)}
        {timeButton('1Y', 360)}
      </MultiButton>
      <MultiButton>
        {typeButton('amount', 'Amount')}
        {typeButton('tokens', 'Tokens')}
        {typeButton('fee', 'Fees')}
      </MultiButton>
    </ResponsiveSingle>
  );
};

interface FlowButtonProps {
  isTime: ReportDuration;
  isType: FlowReportType;
  setIsTime: (text: ReportDuration) => void;
  setIsType: (text: FlowReportType) => void;
}

export const FlowButtonRow: React.FC<FlowButtonProps> = ({
  isTime,
  setIsTime,
  isType,
  setIsType,
}) => {
  const timeButton = (time: ReportDuration, title: string) => (
    <SingleButton
      withPadding={'4px 8px'}
      onClick={() => setIsTime(time)}
      selected={isTime === time}
    >
      {title}
    </SingleButton>
  );

  const typeButton = (type: FlowReportType, title: string) => (
    <SingleButton
      withPadding={'4px 8px'}
      onClick={() => setIsType(type)}
      selected={isType === type}
    >
      {title}
    </SingleButton>
  );

  return (
    <ResponsiveSingle>
      <MultiButton>
        {timeButton('day', '1D')}
        {timeButton('week', '1W')}
        {timeButton('month', '1M')}
        {timeButton('quarter_year', '3M')}
        {timeButton('half_year', '6M')}
        {timeButton('year', '1Y')}
      </MultiButton>
      <MultiButton>
        {typeButton('amount', 'Amount')}
        {typeButton('tokens', 'Tokens')}
      </MultiButton>
    </ResponsiveSingle>
  );
};
