import styled from "styled-components";
import {
  progressBackground,
  progressLeft,
  progressRight
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

export const ProgressBar = styled.div`
  height: 10px;
  border-radius: 15px;
  background-image: linear-gradient(
    to right,
    ${progressLeft} 0%,
    ${progressLeft} ${({ percent }: { percent: number }) => `${percent}%`},
    ${progressRight} ${({ percent }: { percent: number }) => `${percent}%`},
    ${progressRight} 100%
  );
  width: 100%;
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
