import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { ThemeSet } from 'styled-theming';
import RouterLink from 'next/link';
import { textColor, linkHighlight } from '../../styles/Themes';

interface StyledProps {
  fontColor?: string | ThemeSet;
  underline?: string | ThemeSet;
  inheritColor?: boolean;
  fullWidth?: boolean;
}

const StyledLink = styled.a<StyledProps>`
  cursor: pointer;
  color: ${({ fontColor, inheritColor }) =>
    inheritColor ? 'inherit' : fontColor || textColor};
  text-decoration: none;
  ${({ fullWidth }: StyledProps) =>
    fullWidth &&
    css`
      width: 100%;
    `};

  :hover {
    background: linear-gradient(
      to bottom,
      ${({ underline }: StyledProps) => underline ?? linkHighlight} 0%,
      ${({ underline }: StyledProps) => underline ?? linkHighlight} 100%
    );
    background-position: 0 100%;
    background-size: 2px 2px;
    background-repeat: repeat-x;
  }
`;

const NoStyling = styled.a`
  cursor: pointer;
  text-decoration: none;
`;

interface LinkProps {
  href?: string;
  to?: string;
  color?: string | ThemeSet;
  underline?: string | ThemeSet;
  inheritColor?: boolean;
  fullWidth?: boolean;
  noStyling?: boolean;
  newTab?: boolean;
  children?: ReactNode;
}

export const Link: React.FC<LinkProps> = ({
  children,
  href,
  to,
  color,
  underline,
  inheritColor,
  fullWidth,
  noStyling,
  newTab,
}) => {
  const props = { fontColor: color, underline, inheritColor, fullWidth };

  if (!href && !to) return null;

  const CorrectLink = noStyling ? NoStyling : StyledLink;

  if (href) {
    return (
      <CorrectLink
        href={href}
        {...props}
        {...(newTab && { target: '_blank', rel: 'noreferrer noopener' })}
      >
        {children}
      </CorrectLink>
    );
  }

  if (to) {
    return (
      <RouterLink href={to} passHref legacyBehavior>
        <CorrectLink {...props}>{children}</CorrectLink>
      </RouterLink>
    );
  }

  return null;
};
