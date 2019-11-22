import styled from "styled-components";
import {
  progressBackground,
  progressFirst,
  progressSecond
} from "../../styles/Themes";

export const Progress = styled.div`
  width: 200px;
  margin: 5px;
  padding: 3px;
  border-radius: 15px;
  background: ${progressBackground};
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25),
    0 1px rgba(255, 255, 255, 0.08);
`;

interface ProgressBar {
  percent: number;
  order?: number;
}

export const ProgressBar = styled.div`
  height: 10px;
  border-radius: 15px;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3),
    rgba(0, 0, 0, 0.05)
  );
  background-color: ${({ order }: ProgressBar) =>
    order === 2 ? progressFirst : progressSecond};
  width: ${({ percent }: ProgressBar) => `${percent}%`};
`;

export const NodeBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NodeDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NodeTitle = styled.div`
  padding: 2px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StatusLine = styled.div`
  width: 100%;
  position: relative;
  right: -8px;
  top: -8px;
  display: flex;
  /* flex-direction: column; */
  justify-content: flex-end;
  /* align-items: flex-start; */
  /* z-index: 2; */
  margin: 0 0 -8px 0;
  /* height: 36px; */
  /* margin-left: 5px; */
  /* margin: -8px -7px 0 0; */
`;

export const StatusDot = styled.div`
  margin: 0 2px;
  height: 8px;
  width: 8px;
  border-radius: 100%;
  background-color: ${({ color }: { color: string }) => color};
`;

export const DetailLine = styled.div`
  font-size: 14px;
  word-wrap: break-word;
  display: flex;
  justify-content: space-between;
`;

export const MainInfo = styled.div`
  cursor: pointer;
`;
