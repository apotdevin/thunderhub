import { FC, ReactNode } from 'react';
import { DarkSubTitle } from '../../components/generic/Styled';
import { useChartColors } from '../../lib/chart-colors';
import { useStatsState } from './context';
import { getProgressColor } from './helpers';

const SIZE = 200;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CircularProgress: FC<{
  value: number;
  pathColor: string;
  children: ReactNode;
}> = ({ value, pathColor, children }) => {
  const offset = CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height="100%">
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth={STROKE}
      />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke={pathColor}
        strokeWidth={STROKE}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
      />
      <foreignObject x="0" y="0" width={SIZE} height={SIZE}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          {children}
        </div>
      </foreignObject>
    </svg>
  );
};

export const StatResume = () => {
  const chartColors = useChartColors();
  const { volumeScore, timeScore, feeScore } = useStatsState();

  return (
    <>
      <div className="text-2xl w-full text-center">Node Statistics</div>
      <div className="flex justify-around my-4 md:my-8">
        <div className="w-[30%] md:w-[20%]">
          <CircularProgress
            value={volumeScore || 0}
            pathColor={getProgressColor(volumeScore, chartColors)}
          >
            <DarkSubTitle>Flow</DarkSubTitle>
            <div className="text-lg md:text-[32px]">{volumeScore}</div>
          </CircularProgress>
        </div>
        <div className="w-[30%] md:w-[20%]">
          <CircularProgress
            value={timeScore || 0}
            pathColor={getProgressColor(timeScore, chartColors)}
          >
            <DarkSubTitle>Time</DarkSubTitle>
            <div className="text-lg md:text-[32px]">{timeScore}</div>
          </CircularProgress>
        </div>
        <div className="w-[30%] md:w-[20%]">
          <CircularProgress
            value={feeScore || 0}
            pathColor={getProgressColor(feeScore, chartColors)}
          >
            <DarkSubTitle>Fee</DarkSubTitle>
            <div className="text-lg md:text-[32px]">{feeScore}</div>
          </CircularProgress>
        </div>
      </div>
    </>
  );
};
