import * as React from 'react';
import { chartColors } from '../../styles/Themes';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export const getProgressColor = (score: number | null | undefined): string => {
  if (!score) return chartColors.red;
  switch (true) {
    case score > 90:
      return chartColors.green;
    case score > 75:
      return chartColors.darkyellow;
    case score > 60:
      return chartColors.orange;
    case score > 50:
      return chartColors.orange2;
    default:
      return chartColors.red;
  }
};

export const getIcon = (
  score: number | null | undefined,
  notSignificant?: boolean
): JSX.Element => {
  if (!score) {
    return <XCircle color={getProgressColor(score)} />;
  }
  if (notSignificant) {
    return <AlertCircle color={chartColors.orange} />;
  }
  switch (true) {
    case score > 90:
      return <CheckCircle color={getProgressColor(score)} />;
    case score > 75:
      return <CheckCircle color={getProgressColor(score)} />;
    case score > 60:
      return <CheckCircle color={getProgressColor(score)} />;
    case score > 50:
      return <XCircle color={getProgressColor(score)} />;
    default:
      return <XCircle color={getProgressColor(score)} />;
  }
};

export const getFeeMessage = (
  score: number | null | undefined,
  isOver: boolean | null | undefined,
  isBase?: boolean
): string => {
  if (!score) return '';
  let message = '';
  const ending = isBase ? 'base fees' : 'ppm fees';
  switch (true) {
    case score > 90:
      message = 'This channel has very good';
      break;
    case score > 75:
      message = 'This channel has good';
      break;
    case score > 60 && isOver:
      message = 'This channel has above average high';
      break;
    case score > 60:
      message = 'This channel could have higher';
      break;
    case score > 50 && isOver:
      message = 'This channel has high';
      break;
    case score > 50:
      message = 'This channel has too low';
      break;
    case isOver:
      message = 'This channel has very high';
      break;
    default:
      message = 'This channel has very low';
      break;
  }
  return `${message} ${ending}`;
};

export const getTimeMessage = (score: number | undefined | null): string => {
  if (!score) return '';
  let message = '';
  switch (true) {
    case score > 90:
      message = 'This channel has very good uptime';
      break;
    case score > 75:
      message = 'This channel has good uptime';
      break;
    case score > 60:
      message = 'This channel has average uptime';
      break;
    case score > 50:
      message = 'This channel has below average uptime';
      break;
    default:
      message = 'This channel has very bad uptime';
      break;
  }
  return message;
};

export const getVolumeMessage = (score: number | undefined | null): string => {
  if (!score) return '';
  let message = '';
  switch (true) {
    case score > 100:
      message = `This channel moves ${
        score - 100
      }% more volume than the average from all your channels`;
      break;
    case score > 90:
      message = 'This channel moves very good volume';
      break;
    case score > 75:
      message = 'This channel moves good volume';
      break;
    case score > 60:
      message = 'This channel moves average volume';
      break;
    case score > 50:
      message = 'This channel moves below average volume';
      break;
    default:
      message = 'This channel moves very low volume';
      break;
  }
  return message;
};
