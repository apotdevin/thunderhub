import styled, { css } from 'styled-components';
import { DetailLine } from '../../components/generic/CardGeneric';
import {
  OverflowText,
  DarkSubTitle,
  SubCard,
} from '../../components/generic/Styled';
import { cardBorderColor, subCardColor, cardColor } from '../../styles/Themes';

export const ChatColumn = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid ${cardBorderColor};
  margin: 0 0 16px;
  padding-bottom: 8px;
  height: 100%;
  min-height: 0;
  background-color: ${subCardColor};
`;

export const ChatColumnWithInput = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ChatStyledLine = styled<{ rightAlign: boolean }>(DetailLine)`
  width: 100%;
  align-items: center;
  ${({ rightAlign }) =>
    rightAlign &&
    css`
      justify-content: flex-end;
    `};
`;

export const ChatDaySeparator = styled.div`
  width: 100%;
  font-size: 14px;
  text-align: center;
  margin: 8px 16px;
  padding: 8px;
`;

export const ChatStyledDark = styled(DarkSubTitle)`
  font-size: 12px;
  width: 50px;
  margin-left: 18px;
`;

export const ChatStyledMessage = styled(OverflowText)`
  background-color: ${cardColor};
  max-width: 60%;
  padding: 8px 16px;
  border-radius: 8px;
`;

export const ChatContactColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 30%;
  margin-right: 16px;
`;

export const ChatStyledSubCard = styled(SubCard)`
  width: 100%;
  cursor: pointer;
`;

export const ChatStyledStart = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
