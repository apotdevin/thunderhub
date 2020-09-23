import { Fragment } from 'react';
import styled, { css } from 'styled-components';
import { ProgressBar } from '../generic/CardGeneric';

type BalanceLineProps = {
  withBorderColor?: boolean;
};

const BalanceLine = styled.div<BalanceLineProps>`
  width: 100%;
  display: flex;
  position: relative;

  ${({ withBorderColor }) =>
    withBorderColor &&
    css`
      border: 1px solid gold;
    `}
`;

const SingleLine = styled(BalanceLine)`
  margin-bottom: 4px;
`;

const ValueBox = styled.div`
  position: absolute;
  font-size: 14px;
  padding: 0 8px;
  font-weight: bolder;
`;

const Value = styled(ValueBox)`
  right: 50%;
  text-align: right;
`;

const RightValue = styled(ValueBox)`
  left: 50%;
  text-align: left;
`;

type BalanceProps = {
  local: number;
  remote: number;
  formatLocal?: string;
  formatRemote?: string;
  height?: number;
  withBorderColor?: boolean;
};

export const BalanceBars = ({
  local,
  remote,
  formatLocal,
  formatRemote,
  height = 20,
  withBorderColor = false,
}: BalanceProps) => {
  const localOpposite = 100 - local;
  const remoteOpposite = 100 - remote;

  const hasLocal =
    formatLocal &&
    formatLocal !== '0' &&
    formatLocal !== '0.0' &&
    formatLocal !== '0.00';
  const hasRemote =
    formatRemote &&
    formatRemote !== '0' &&
    formatRemote !== '0.0' &&
    formatRemote !== '0.00';

  return (
    <BalanceLine withBorderColor={withBorderColor}>
      {hasLocal && <Value>{formatLocal}</Value>}
      {hasRemote && <RightValue>{formatRemote}</RightValue>}
      <ProgressBar barHeight={height} order={4} percent={localOpposite} />
      <ProgressBar barHeight={height} order={1} percent={local} />
      <ProgressBar barHeight={height} order={2} percent={remote} />
      <ProgressBar barHeight={height} order={4} percent={remoteOpposite} />
    </BalanceLine>
  );
};

type SingleBarType = {
  value: number;
  height?: number;
};

export const SingleBar = ({ value, height }: SingleBarType) => {
  const opposite = 100 - value;
  let color = 2;

  switch (true) {
    case value > 80:
      color = 7;
      break;
    case value > 50:
      color = 5;
      break;
    case value > 25:
      color = 3;
      break;
    case value > 10:
      color = 6;
      break;
  }

  return (
    <SingleLine>
      <ProgressBar barHeight={height} order={color} percent={value} />
      <ProgressBar barHeight={height} order={8} percent={opposite} />
    </SingleLine>
  );
};

type SumBarProps = {
  values: number[];
  height?: number;
};

export const SumBar = ({ values, height = 20 }: SumBarProps) => {
  const total = values.reduce((prev, current) => prev + current, 0);

  const missing = Math.max(100, total) - total;

  return (
    <SingleLine>
      {values.map((value, index) => (
        <Fragment key={index}>
          <ProgressBar barHeight={height} order={index % 4} percent={value} />
        </Fragment>
      ))}
      <ProgressBar barHeight={height} order={4} percent={missing} />
    </SingleLine>
  );
};
