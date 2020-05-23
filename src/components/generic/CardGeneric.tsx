import styled from 'styled-components';
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

interface ProgressBar {
  percent: number;
  order?: number;
}

export const ProgressBar = styled.div<ProgressBar>`
  height: 10px;
  background-color: ${({ order }) => {
    switch (order) {
      case 1:
        return chartColors.lightblue;
      case 2:
        return chartColors.green;
      case 3:
        return chartColors.orange;
      case 4:
        return progressBackground;
      default:
        return chartColors.purple;
    }
  }};
  width: ${({ percent }) => `${percent}%`};
`;

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

export const MainInfo = styled.div`
  cursor: pointer;
`;

export const StatusDot = styled.div`
  margin: 0 2px;
  height: 8px;
  width: 8px;
  border-radius: 100%;
  background-color: ${({ color }: { color: string }) => color};
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

export const ColLine = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 30%;
  width: 100%;
`;
