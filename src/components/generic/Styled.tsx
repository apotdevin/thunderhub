import styled, { css } from 'styled-components';
import { ThemeSet } from 'styled-theming';
import {
  cardColor,
  cardBorderColor,
  subCardColor,
  smallLinkColor,
  unSelectedNavButton,
  textColor,
  chartLinkColor,
  inverseTextColor,
  separationColor,
  mediaWidths,
  colorButtonBackground,
  colorButtonBorder,
  hoverTextColor,
} from '../../styles/Themes';

export const CardWithTitle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const CardTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

export interface CardProps {
  bottom?: string;
  cardPadding?: string;
  mobileCardPadding?: string;
  mobileNoBackground?: boolean;
}

export const Card = styled.div<CardProps>`
  padding: ${({ cardPadding }) => cardPadding ?? '16px'};
  background: ${cardColor};
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid ${cardBorderColor};
  margin-bottom: ${({ bottom }) => (bottom ? bottom : '25px')};
  width: 100%;

  @media (${mediaWidths.mobile}) {
    ${({ mobileNoBackground }) =>
      mobileNoBackground &&
      css`
        background: unset;
        border: none;
        box-shadow: none;
      `}
    ${({ cardPadding, mobileCardPadding }) =>
      mobileCardPadding
        ? css`
            padding: ${mobileCardPadding};
          `
        : cardPadding
        ? css`
            padding: ${cardPadding};
          `
        : ''};
  }
`;

interface SeparationProps {
  height?: number;
  lineColor?: string | ThemeSet;
}

export const Separation = styled.div<SeparationProps>`
  height: ${({ height }) => (height ? height : '1')}px;
  background-color: ${({ lineColor }) => lineColor ?? separationColor};
  width: 100%;
  margin: 16px 0;
`;

interface SubCardProps {
  color?: string;
  padding?: string;
  withMargin?: string;
  noCard?: boolean;
}

export const SubCard = styled.div<SubCardProps>`
  margin: ${({ withMargin }) => (withMargin ? withMargin : '0 0 10px 0')};
  padding: ${({ padding }) => (padding ? padding : '16px')};
  background: ${subCardColor};
  border: 1px solid ${cardBorderColor};
  border-left: ${({ color }) => (color ? `2px solid ${color}` : '')};

  &:hover {
    box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  }
`;

export const SmallLink = styled.a`
  text-decoration: none;
  color: ${smallLinkColor};

  &:hover {
    text-decoration: underline;
  }
`;

type SubTitleProps = {
  subtitleColor?: string | ThemeSet;
  fontWeight?: string;
  inverseColor?: boolean;
};

export const SubTitle = styled.h4<SubTitleProps>`
    color: ${({ inverseColor }) =>
      inverseColor ? inverseTextColor : textColor};
    margin: 5px 0;
    ${({ subtitleColor }) =>
      subtitleColor &&
      css`
        color: ${subtitleColor};
      `}
    font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : '500')};
`;

export const InverseSubtitle = styled(SubTitle)`
  color: ${inverseTextColor};
`;

export const Sub4Title = styled.h5`
  margin: 10px 0;
  font-weight: 500;
`;

export const NoWrapTitle = styled(Sub4Title)`
  white-space: nowrap;
`;

export const SingleLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RightAlign = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const ColumnLine = styled.div`
  display: flex;
  flex-direction: column;

  @media (${mediaWidths.mobile}) {
    width: 100%;
  }
`;

interface DarkProps {
  fontSize?: string;
  withMargin?: string;
}

export const DarkSubTitle = styled.div<DarkProps>`
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '14px')};
  color: ${unSelectedNavButton};
  margin: ${({ withMargin }) => (withMargin ? withMargin : '0')};
`;

export const SmallButton = styled.button`
  cursor: pointer;
  outline: none;
  padding: 5px;
  margin: 5px;
  text-decoration: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  white-space: nowrap;
  color: ${chartLinkColor};
  background-color: ${colorButtonBackground};

  &:hover {
    color: ${hoverTextColor};
    background-color: ${colorButtonBorder};
  }
`;

export const OverflowText = styled.div`
  margin-left: 16px;

  -ms-word-break: break-all;
  word-break: break-all;
  word-break: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;

  @media (${mediaWidths.mobile}) {
    margin-left: 8px;
  }
`;

export const ResponsiveLine = styled(SingleLine)`
    width: 100%;
    ${({ withWrap }: { withWrap?: boolean }) =>
      withWrap &&
      css`
        flex-wrap: wrap;
      `}

    @media (${mediaWidths.mobile}) {
        flex-direction: column;
    }
`;

export const ResponsiveCol = styled.div`
  flex-grow: 1;

  @media (${mediaWidths.mobile}) {
    width: 100%;
  }
`;

export const ResponsiveSingle = styled(SingleLine)`
  flex-grow: 1;
  min-width: 200px;

  @media (${mediaWidths.mobile}) {
    width: 100%;
  }
`;
