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

const FullWidth = styled.div<FullWidthProps>`
  width: 100%;
  ${({ padding }) =>
    padding &&
    css`
      padding: ${padding};
    `}
  ${({ textColor }) =>
    textColor &&
    css`
      color: ${textColor};
    `}
    background-color: ${({ sectionColor }) =>
    sectionColor ? sectionColor : backgroundColor};

  @media (${mediaWidths.mobile}) {
    padding: 16px 0;
  }
`;

const FixedWidth = styled.div`
  max-width: 1000px;
  margin: 0 auto 0;

  @media (max-width: 1035px) {
    padding: 0 16px;
  }
`;

type SectionProps = {
  fixedWidth?: boolean;
  color?: string | ThemeSet;
  textColor?: string | ThemeSet;
  padding?: string;
  children?: ReactNode;
};

export const Section: React.FC<SectionProps> = ({
  fixedWidth = false,
  children,
  color,
  textColor,
  padding,
}) => {
  const Fixed = fixedWidth ? FixedWidth : React.Fragment;

  return (
    <FullWidth padding={padding} sectionColor={color} textColor={textColor}>
      <Fixed>{children}</Fixed>
    </FullWidth>
  );
};
