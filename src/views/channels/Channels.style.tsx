import styled from 'styled-components';
import {
  progressBackground,
  progressFirst,
  progressSecond,
  mediaWidths,
} from '../../styles/Themes';

export const Progress = styled.div`
  margin: 5px;
  background: ${progressBackground};
`;

interface ProgressBar {
  percent: number;
  order?: number;
}

export const ProgressBar = styled.div`
  height: 10px;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3),
    rgba(0, 0, 0, 0.05)
  );
  background-color: ${({ order }: ProgressBar) =>
    order === 2 ? progressFirst : progressSecond};
  width: ${({ percent }: ProgressBar) => `${percent}%`};
`;

export const NodeTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
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
  right: -8px;
  top: -8px;
  display: flex;
  justify-content: flex-end;
  margin: 0 0 -8px 0;
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

export const MainInfo = styled.div`
  cursor: pointer;
`;
