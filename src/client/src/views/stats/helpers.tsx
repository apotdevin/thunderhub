import { ReactElement } from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export type ChartColors = {
  darkyellow: string;
  orange: string;
  orange2: string;
  lightblue: string;
  green: string;
  purple: string;
  red: string;
};

export const getProgressColor = (
  score: number | null | undefined,
  chartColors: ChartColors
): string => {
  if (!score) return chartColors.red;
  if (score > 90) return chartColors.green;
  if (score > 75) return chartColors.darkyellow;
  if (score > 60) return chartColors.orange;
  if (score > 50) return chartColors.orange2;
  return chartColors.red;
};

export const getScoreVariant = (
  score: number | null | undefined
): 'success' | 'warning' | 'danger' => {
  if (!score) return 'danger';
  if (score > 75) return 'success';
  if (score > 50) return 'warning';
  return 'danger';
};

const variantStyles = {
  success:
    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  warning:
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

export const getScoreBadgeClass = (
  score: number | null | undefined
): string => {
  return variantStyles[getScoreVariant(score)];
};

export const getIcon = (
  score: number | null | undefined,
  chartColors: ChartColors,
  notSignificant?: boolean
): ReactElement => {
  const color = getProgressColor(score, chartColors);
  if (!score) return <XCircle size={16} color={color} />;
  if (notSignificant)
    return <AlertCircle size={16} color={chartColors.orange} />;
  if (score > 60) return <CheckCircle size={16} color={color} />;
  return <XCircle size={16} color={color} />;
};

export const getFeeMessage = (
  score: number | null | undefined,
  isOver: boolean | null | undefined,
  isBase?: boolean
): string => {
  if (!score) return '';
  const ending = isBase ? 'base fees' : 'ppm fees';
  let message = '';
  switch (true) {
    case score > 90:
      message = 'Very good';
      break;
    case score > 75:
      message = 'Good';
      break;
    case score > 60 && isOver:
      message = 'Above average high';
      break;
    case score > 60:
      message = 'Could have higher';
      break;
    case score > 50 && isOver:
      message = 'High';
      break;
    case score > 50:
      message = 'Too low';
      break;
    case isOver:
      message = 'Very high';
      break;
    default:
      message = 'Very low';
      break;
  }
  return `${message} ${ending}`;
};

export const getTimeMessage = (score: number | undefined | null): string => {
  if (!score) return '';
  if (score > 90) return 'Very good uptime';
  if (score > 75) return 'Good uptime';
  if (score > 60) return 'Average uptime';
  if (score > 50) return 'Below average uptime';
  return 'Very bad uptime';
};

export const getVolumeMessage = (score: number | undefined | null): string => {
  if (!score) return '';
  if (score > 100)
    return `${score - 100}% more volume than average across your channels`;
  if (score > 90) return 'Very good volume';
  if (score > 75) return 'Good volume';
  if (score > 60) return 'Average volume';
  if (score > 50) return 'Below average volume';
  return 'Very low volume';
};
