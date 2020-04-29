import styled, { css, ThemeSet } from 'styled-components';
import { DetailLine } from '../../components/generic/CardGeneric';
import {
  OverflowText,
  DarkSubTitle,
  SubCard,
  Card,
} from '../../components/generic/Styled';
import {
  cardBorderColor,
  subCardColor,
  mediaWidths,
  textColor,
  chatSubCardColor,
  colorButtonBorder,
  chatBubbleColor,
  chatSentBubbleColor,
  chartColors,
  backgroundColor,
} from '../../styles/Themes';

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

  @media (${mediaWidths.mobile}) {
    border: none;
    background-color: ${backgroundColor};
  }
`;

export const ChatColumnWithInput = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
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

export const ChatDaySeparator = styled.div<{ isLast?: boolean }>`
  width: 100%;
  font-size: 14px;
  text-align: center;
  padding: ${({ isLast }) => (isLast ? '32px 0 8px' : '8px 0')};

  @media (${mediaWidths.mobile}) {
    margin: 8px 0;
  }
`;

export const ChatStyledDark = styled(DarkSubTitle)`
  font-size: 12px;
  margin: 0;
  white-space: nowrap;
`;

export const ChatStyledMessage = styled(OverflowText)<{
  bubbleColor: string | ThemeSet;
}>`
  position: relative;
  background-color: ${({ bubbleColor }) => bubbleColor || chatBubbleColor};
  color: white;
  max-width: 60%;
  padding: 12px 16px;
  border-radius: 8px;

  @media (${mediaWidths.mobile}) {
    max-width: 80%;
    margin: 0;
  }
`;

export const ChatContactColumn = styled.div<{ hide?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 30%;
  margin-right: 16px;

  @media (${mediaWidths.mobile}) {
    width: 100%;
    background-color: ${backgroundColor};
    ${({ hide }) => hide && 'display: none;'}
  }
`;

export const ChatStyledStart = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (${mediaWidths.mobile}) {
    background-color: ${backgroundColor};
  }
`;

export const ChatTitle = styled.div`
  width: 100%;
  font-weight: bolder;
  text-align: center;
  color: ${textColor};
  font-size: 24px;

  @media (${mediaWidths.mobile}) {
    font-size: 16px;
  }
`;

export const ChatSubCard = styled(SubCard)<{ open?: boolean }>`
  background: ${chatSubCardColor};
  cursor: pointer;
  width: 100%;

  &:hover {
    box-shadow: unset;
    ${({ open }) =>
      !open &&
      css`
        background-color: ${colorButtonBorder};
        color: white;
      `}
  }

  @media (${mediaWidths.mobile}) {
    margin: 16px 0 -4px;
  }
`;

export const ChatStyledSubTitle = styled.h4`
  font-weight: 500;
`;

export const ChatBoxAlias = styled.div`
  position: absolute;
  text-align: center;
  width: 100%;
  font-size: 18px;
  margin-top: 8px;

  @media (${mediaWidths.mobile}) {
    display: none;
  }
`;

export const ChatFeePaid = styled.div`
  font-size: 12px;
  color: ${chartColors.orange2};
`;

export const ChatFeeDateColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 5px 16px;
  width: 50px;

  @media (${mediaWidths.mobile}) {
    display: none;
  }
`;

export const ChatCard = styled(Card)`
  @media (${mediaWidths.mobile}) {
    border: none;
  }
`;

export const ChatBubbleMessage = styled.div`
  display: flex;
  align-items: center;
`;

export const StatusChatDot = styled.div`
  position: absolute;
  top: -4px;
  right: 3px;
`;

export const ChatSendButton = styled.div`
  margin: 0 0 0 16px;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${chatSentBubbleColor};
  white-space: nowrap;
  cursor: pointer;

  :hover {
    color: ${chatSentBubbleColor};
    background: white;
  }
`;
