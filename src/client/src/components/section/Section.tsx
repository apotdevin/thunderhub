import React from 'react';
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
    background-color: ${({ sectionColor }: FullWidthProps) =>
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
};

export const Section: React.FC<SectionProps> = ({
  fixedWidth = true,
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
