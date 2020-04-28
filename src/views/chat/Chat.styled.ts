import styled, { css } from 'styled-components';
import { DetailLine } from '../../components/generic/CardGeneric';
import {
  OverflowText,
  DarkSubTitle,
  SubCard,
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

export const ChatDaySeparator = styled.div`
  width: 100%;
  font-size: 14px;
  text-align: center;
  margin: 8px 0;
  padding: 8px;
`;

export const ChatStyledDark = styled(DarkSubTitle)`
  font-size: 12px;
  margin: 0;
  white-space: nowrap;
`;

export const ChatStyledMessage = styled(OverflowText)<{
  isSent?: boolean;
  verified?: boolean;
}>`
  background-color: ${({ isSent, verified }) =>
    !verified
      ? chartColors.orange2
      : isSent
      ? chatSentBubbleColor
      : chatBubbleColor};
  color: white;
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

export const ChatStyledStart = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
`;
