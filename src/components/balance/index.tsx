import * as React from 'react';
import styled from 'styled-components';
import { ProgressBar } from '../generic/CardGeneric';

const BalanceLine = styled.div`
  width: 100%;
  display: flex;
  position: relative;
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
};

export const BalanceBars = ({
  local,
  remote,
  formatLocal,
  formatRemote,
  height = 20,
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
    <BalanceLine>
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
