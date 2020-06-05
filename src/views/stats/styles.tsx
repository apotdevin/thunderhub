import styled from 'styled-components';
import { DarkSubTitle } from 'src/components/generic/Styled';
import { chartColors } from 'src/styles/Themes';

export const ScoreColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ScoreLine = styled.div`
  display: flex;
  justify-content: space-between;
  width: 160px;
`;

type StatHeaderProps = {
  isOpen?: boolean;
};

export const StatHeaderLine = styled.div<StatHeaderProps>`
  cursor: pointer;
  display: flex;
  padding: 8px 0 16px;
  margin-bottom: ${({ isOpen }) => (isOpen ? 0 : '-8px')};
  justify-content: space-between;
  align-items: center;
`;

export const StatsTitle = styled.div`
  font-size: 24px;
  width: 100%;
  text-align: center;
`;

type WarningProps = {
  warningColor?: string;
};

export const WarningText = styled(DarkSubTitle)<WarningProps>`
  width: 100%;
  text-align: center;
  color: ${({ warningColor }) =>
    warningColor ? warningColor : chartColors.orange};
`;

export const Clickable = styled.div`
  cursor: pointer;
`;
