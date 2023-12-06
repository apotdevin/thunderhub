import styled, { css } from 'styled-components';
import { ThemeSet } from 'styled-theming';
import {
  progressBackground,
  mediaWidths,
  cardColor,
  cardBorderColor,
  chartColors,
} from '../../styles/Themes';

export const Progress = styled.div`
  margin: 5px;
  background: ${progressBackground};
`;

type ProgressBar = {
  percent: number;
  order?: number;
  barHeight?: number;
};

export const ProgressBar = styled.div.attrs<ProgressBar>(
  ({ order, percent, barHeight }) => {
    let color: string | ThemeSet = chartColors.purple;
    switch (order) {
      case 1:
        color = chartColors.lightblue;
        break;
      case 2:
        color = chartColors.green;
        break;
      case 3:
        color = chartColors.orange;
        break;
      case 4:
        color = progressBackground;
        break;
      case 5:
        color = chartColors.orange2;
        break;
      case 6:
        color = chartColors.darkyellow;
        break;
      case 7:
        color = chartColors.red;
        break;
      case 8:
        color = 'transparent';
        break;
    }

    return {
      style: {
        'background-color': color,
        height: barHeight ? `${barHeight}px` : '10px',
        width: `${percent}%`,
      },
    };
  }
)``;

export const NodeTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (${mediaWidths.mobile}) {
    width: unset;
    margin-bottom: 8px;
  }
`;

export const StatusLine = styled.div`
  width: 100%;
  position: relative;
  right: -12px;
  top: -12px;
  display: flex;
  justify-content: flex-end;
  margin: 0 0 -8px 0;
`;

type MainProps = {
  disabled?: boolean;
};

export const MainInfo = styled.div<MainProps>`
  ${({ disabled }) =>
    !disabled &&
    css`
      cursor: pointer;
    `}
`;

export const StatusDot = styled.div<{ color: string }>`
  margin: 0 2px;
  height: 8px;
  width: 8px;
  border-radius: 100%;
  background-color: ${({ color }) => color};
`;

export const DetailLine = styled.div`
  margin: 4px 0;
  font-size: 14px;
  word-wrap: break-word;
  display: flex;
  justify-content: space-between;

  @media (${mediaWidths.mobile}) {
    flex-wrap: wrap;
  }
`;

export interface CardProps {
  bottom?: string;
  cardPadding?: string;
}

export const Card = styled.div<CardProps>`
  padding: ${({ cardPadding }) => cardPadding ?? '16px'};
  background: ${cardColor};
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid ${cardBorderColor};
  margin-bottom: ${({ bottom }) => (bottom ? bottom : '25px')};
  width: 100%;
`;
