import styled from 'styled-components';
import { SubCard, SingleLine } from '../../components/generic/Styled';
import { mediaWidths, themeColors } from '../../styles/Themes';

export const FullWidthSubCard = styled(SubCard)`
  width: 100%;
  align-self: stretch;
`;

export const WithSpaceSubCard = styled(FullWidthSubCard)`
  margin-right: 12px;

  @media (${mediaWidths.mobile}) {
    margin-right: 0;
  }
`;

export const RebalanceTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
`;

export const RebalanceTag = styled.div`
  padding: 2px 8px;
  border: 1px solid ${themeColors.blue2};
  border-radius: 4px;
  margin-right: 8px;
  font-size: 14px;

  @media (${mediaWidths.mobile}) {
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const RebalanceLine = styled(SingleLine)`
  margin-bottom: 8px;
`;

export const RebalanceWrapLine = styled(SingleLine)`
  flex-wrap: wrap;
`;

export const RebalanceSubTitle = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;
