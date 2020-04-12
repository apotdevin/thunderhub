import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { ThemeSet } from 'styled-theming';
import { backgroundColor, mediaWidths } from '../../styles/Themes';

interface FullWidthProps {
  padding?: string;
  withColor?: boolean;
  sectionColor?: string | ThemeSet;
  textColor?: string | ThemeSet;
}

const FullWidth = styled.div`
    width: 100%;
    ${({ padding }: FullWidthProps) =>
      padding &&
      css`
        padding: ${padding};
      `}
    ${({ textColor }: FullWidthProps) =>
      textColor &&
      css`
        color: ${textColor};
      `}
    background-color: ${({ withColor, sectionColor }: FullWidthProps) =>
      withColor && (sectionColor ? sectionColor : backgroundColor)};

    @media (${mediaWidths.mobile}) {
        padding: 16px 0;
    }
`;

const FixedWidth = styled.div`
  max-width: 1000px;
  margin: 0 auto 0 auto;

  @media (max-width: 1035px) {
    padding: 0 16px;
  }
`;

export const Section = ({
  fixedWidth = true,
  withColor = true,
  children,
  color,
  textColor,
  padding,
}: {
  fixedWidth?: boolean;
  withColor?: boolean;
  color?: any;
  textColor?: any;
  padding?: string;
  children: ReactNode;
}) => {
  const Fixed = fixedWidth ? FixedWidth : React.Fragment;

  return (
    <FullWidth
      padding={padding}
      withColor={withColor}
      sectionColor={color}
      textColor={textColor}
    >
      <Fixed>{children}</Fixed>
    </FullWidth>
  );
};
