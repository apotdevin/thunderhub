import * as React from 'react';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import styled from 'styled-components';
import { DarkSubTitle } from 'src/components/generic/Styled';
import { themeColors, chartColors } from 'src/styles/Themes';
import { useStatsState } from './context';

const ProgressRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 32px 0;
`;

const ProgressCard = styled.div`
  width: 20%;
`;

const ScoreTitle = styled.div`
  font-size: 32px;
`;

const getProgressColor = (score: number): string => {
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

export const StatResume = () => {
  const { volumeScore, timeScore, feeScore } = useStatsState();

  return (
    <>
      {/* <ScoreTitle>ThunderStats</ScoreTitle> */}
      <ProgressRow>
        <ProgressCard>
          <CircularProgressbarWithChildren
            value={volumeScore}
            styles={buildStyles({
              pathColor: getProgressColor(volumeScore),
              trailColor: themeColors.blue7,
            })}
          >
            <DarkSubTitle>Volume</DarkSubTitle>
            <ScoreTitle>{volumeScore}</ScoreTitle>
          </CircularProgressbarWithChildren>
        </ProgressCard>
        <ProgressCard>
          <CircularProgressbarWithChildren
            value={timeScore}
            styles={buildStyles({
              pathColor: getProgressColor(timeScore),
              trailColor: themeColors.blue7,
            })}
          >
            <DarkSubTitle>Time</DarkSubTitle>
            <ScoreTitle>{timeScore}</ScoreTitle>
          </CircularProgressbarWithChildren>
        </ProgressCard>
        <ProgressCard>
          <CircularProgressbarWithChildren
            value={feeScore}
            styles={buildStyles({
              pathColor: getProgressColor(feeScore),
              trailColor: themeColors.blue7,
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
