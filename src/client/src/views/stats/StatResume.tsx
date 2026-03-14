import { FC, ReactNode } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Activity } from 'lucide-react';
import { useChartColors } from '../../lib/chart-colors';
import { useStatsState } from './context';
import { getProgressColor, getScoreVariant } from './helpers';

const SIZE = 160;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CircularProgress: FC<{
  value: number;
  pathColor: string;
  children: ReactNode;
}> = ({ value, pathColor, children }) => {
  const offset = CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          className="stroke-muted"
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
          className="transition-all duration-500 ease-out"
        />
        <foreignObject x="0" y="0" width={SIZE} height={SIZE}>
          <div className="flex flex-col items-center justify-center h-full gap-0.5">
            {children}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

const variantLabel: Record<string, string> = {
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
};

const ScoreRing: FC<{
  label: string;
  score: number | null;
}> = ({ label, score }) => {
  const chartColors = useChartColors();
  const variant = getScoreVariant(score);

  return (
    <div className="flex flex-col items-center gap-1 w-28 md:w-36">
      <CircularProgress
        value={score || 0}
        pathColor={getProgressColor(score, chartColors)}
      >
        <span
          className={`text-2xl md:text-3xl font-semibold font-mono ${variantLabel[variant]}`}
        >
          {score ?? '—'}
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      </CircularProgress>
    </div>
  );
};

export const StatResume = () => {
  const { volumeScore, timeScore, feeScore } = useStatsState();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Activity size={16} className="text-muted-foreground" />
        Node Health
      </h2>
      <Card>
        <CardContent>
          <div className="flex justify-around items-center">
            <ScoreRing label="Flow" score={volumeScore} />
            <ScoreRing label="Uptime" score={timeScore} />
            <ScoreRing label="Fees" score={feeScore} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
