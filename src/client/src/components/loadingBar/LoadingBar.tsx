import React from 'react';
import styled from 'styled-components';
import { progressBackground } from '../../styles/Themes';

const Progress = styled.div`
  width: 100%;
  background: ${progressBackground};
`;

interface ProgressBar {
  percent: number;
  barColor?: string;
}

const ProgressBar = styled.div`
  height: 10px;
  background-color: ${({ barColor }: ProgressBar) =>
    barColor ? barColor : 'blue'};
  width: ${({ percent }: ProgressBar) => `${percent}%`};
`;

const getColor = (percent: number) => {
  switch (true) {
    case percent < 20:
      return '#ff4d4f';
    case percent < 40:
      return '#ff7a45';
    case percent < 60:
      return '#ffa940';
    case percent < 80:
      return '#bae637';
    case percent <= 100:
      return '#73d13d';
    default:
      return '';
  }
};

export const LoadingBar = ({ percent }: { percent: number }) => (
  <Progress>
    <ProgressBar percent={percent} barColor={getColor(percent)} />
  </Progress>
);
