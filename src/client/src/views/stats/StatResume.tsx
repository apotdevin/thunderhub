import * as React from 'react';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
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

export const StatResume = () => {
  const { volumeScore, timeScore, feeScore } = useStatsState();

  return (
    <>
      <StatsTitle>Node Statistics</StatsTitle>
      <ProgressRow>
        <ProgressCard>
          <CircularProgressbarWithChildren
            value={volumeScore || 0}
            styles={buildStyles({
              pathColor: getProgressColor(volumeScore),
              trailColor: 'rgba(0, 0, 0, 0.1)',
            })}
          >
            <DarkSubTitle>Flow</DarkSubTitle>
            <ScoreTitle>{volumeScore}</ScoreTitle>
          </CircularProgressbarWithChildren>
        </ProgressCard>
        <ProgressCard>
          <CircularProgressbarWithChildren
            value={timeScore || 0}
            styles={buildStyles({
              pathColor: getProgressColor(timeScore),
              trailColor: 'rgba(0, 0, 0, 0.1)',
            })}
          >
            <DarkSubTitle>Time</DarkSubTitle>
            <ScoreTitle>{timeScore}</ScoreTitle>
          </CircularProgressbarWithChildren>
        </ProgressCard>
        <ProgressCard>
          <CircularProgressbarWithChildren
            value={feeScore || 0}
            styles={buildStyles({
              pathColor: getProgressColor(feeScore),
              trailColor: 'rgba(0, 0, 0, 0.1)',
            })}
          >
            <DarkSubTitle>Fee</DarkSubTitle>
            <ScoreTitle>{feeScore}</ScoreTitle>
          </CircularProgressbarWithChildren>
        </ProgressCard>
      </ProgressRow>
    </>
  );
};
