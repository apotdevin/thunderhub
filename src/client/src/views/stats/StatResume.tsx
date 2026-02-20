import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { DarkSubTitle } from '../../components/generic/Styled';
import { mediaWidths } from '../../styles/Themes';
import { useStatsState } from './context';
import { StatsTitle } from './styles';
import { getProgressColor } from './helpers';

const ProgressRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 32px 0;

  @media (${mediaWidths.mobile}) {
    margin: 16px 0;
  }
`;

const ProgressCard = styled.div`
  width: 20%;

  @media (${mediaWidths.mobile}) {
    width: 30%;
  }
`;

const ScoreTitle = styled.div`
  font-size: 32px;

  @media (${mediaWidths.mobile}) {
    font-size: 18px;
  }
`;

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
  const { volumeScore, timeScore, feeScore } = useStatsState();

  return (
    <>
      <StatsTitle>Node Statistics</StatsTitle>
      <ProgressRow>
        <ProgressCard>
          <CircularProgress
            value={volumeScore || 0}
            pathColor={getProgressColor(volumeScore)}
          >
            <DarkSubTitle>Flow</DarkSubTitle>
            <ScoreTitle>{volumeScore}</ScoreTitle>
          </CircularProgress>
        </ProgressCard>
        <ProgressCard>
          <CircularProgress
            value={timeScore || 0}
            pathColor={getProgressColor(timeScore)}
          >
            <DarkSubTitle>Time</DarkSubTitle>
            <ScoreTitle>{timeScore}</ScoreTitle>
          </CircularProgress>
        </ProgressCard>
        <ProgressCard>
          <CircularProgress
            value={feeScore || 0}
            pathColor={getProgressColor(feeScore)}
          >
            <DarkSubTitle>Fee</DarkSubTitle>
            <ScoreTitle>{feeScore}</ScoreTitle>
          </CircularProgress>
        </ProgressCard>
      </ProgressRow>
    </>
  );
};
