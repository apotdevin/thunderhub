import * as React from 'react';
import styled from 'styled-components';
import { ProgressBar } from '../generic/CardGeneric';

const BalanceLine = styled.div`
  width: 100%;
  display: flex;
  position: relative;
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
};

export const BalanceBars = ({
  local,
  remote,
  formatLocal,
  formatRemote,
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
    <>
      <BalanceLine>
        {hasLocal && <Value>{formatLocal}</Value>}
        {hasRemote && <RightValue>{formatRemote}</RightValue>}
        <ProgressBar barHeight={20} order={4} percent={localOpposite} />
        <ProgressBar barHeight={20} order={1} percent={local} />
        <ProgressBar barHeight={20} order={2} percent={remote} />
        <ProgressBar barHeight={20} order={4} percent={remoteOpposite} />
      </BalanceLine>
    </>
  );
};
