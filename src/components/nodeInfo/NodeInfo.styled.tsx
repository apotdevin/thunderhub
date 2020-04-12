import styled, { css } from 'styled-components';
import { Card } from '../generic/Styled';
import { ChevronLeft, ChevronRight } from '../generic/Icons';
import {
  inverseTextColor,
  buttonBorderColor,
  textColor,
  mediaWidths,
} from '../../styles/Themes';

const arrowCSS = css`
  background-color: ${inverseTextColor};
  height: 32px;
  width: 32px;
  position: absolute;
  z-index: 2;
  top: 50%;
  display: none;
  border-radius: 4px;
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${buttonBorderColor};
  cursor: pointer;

  &:hover {
    border: 1px solid ${textColor};
  }
`;

export const ArrowLeft = styled(ChevronLeft)`
  ${arrowCSS}
  transform: translate(-30%, -50%);
`;

export const ArrowRight = styled(ChevronRight)`
  ${arrowCSS}
  transform: translate(30%, -50%);
  right: 0;
`;

export const NodeBarContainer = styled.div`
  position: relative;
  margin-bottom: 24px;
  &:hover {
    ${ArrowLeft} {
      display: inline-block;
    }
    ${ArrowRight} {
      display: inline-block;
    }
  }
`;

export const StyledNodeBar = styled.div`
  display: flex;
  overflow-x: scroll;
  -ms-overflow-style: none;
  cursor: pointer;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const sectionColor = '#69c0ff';

export const QuickCard = styled(Card)`
  height: 120px;
  width: 240px;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  margin-bottom: 0px;
  padding: 10px;
  margin-right: 10px;
  cursor: pointer;

  @media (${mediaWidths.mobile}) {
    height: unset;
    width: 160px;
    min-width: 160px;
  }

  &:hover {
    border: 1px solid ${sectionColor};
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
