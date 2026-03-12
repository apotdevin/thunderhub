import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import { ProgressBar } from '../generic/CardGeneric';

type BalanceProps = {
  local: number;
  remote: number;
  formatLocal?: JSX.Element | string;
  formatRemote?: JSX.Element | string;
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
    <div
      className={cn(
        'w-full flex relative',
        withBorderColor && 'border border-[gold]'
      )}
    >
      {hasLocal && (
        <div className="absolute text-sm px-2 font-bold right-1/2 text-right">
          {formatLocal}
        </div>
      )}
      {hasRemote && (
        <div className="absolute text-sm px-2 font-bold left-1/2 text-left">
          {formatRemote}
        </div>
      )}
      <ProgressBar barHeight={height} order={4} percent={localOpposite} />
      <ProgressBar barHeight={height} order={1} percent={local} />
      <ProgressBar barHeight={height} order={2} percent={remote} />
      <ProgressBar barHeight={height} order={4} percent={remoteOpposite} />
    </div>
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
    <div className="w-full flex relative mb-1">
      <ProgressBar barHeight={height} order={color} percent={value} />
      <ProgressBar barHeight={height} order={8} percent={opposite} />
    </div>
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
    <div className="w-full flex relative mb-1">
      {values.map((value, index) => (
        <Fragment key={index}>
          <ProgressBar barHeight={height} order={index % 4} percent={value} />
        </Fragment>
      ))}
      <ProgressBar barHeight={height} order={4} percent={missing} />
    </div>
  );
};
