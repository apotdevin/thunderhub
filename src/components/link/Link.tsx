import React from 'react';
import styled, { css } from 'styled-components';
import { textColor, linkHighlight } from '../../styles/Themes';
import { ThemeSet } from 'styled-theming';
import { Link as RouterLink } from 'react-router-dom';

interface StyledProps {
    fontColor?: string | ThemeSet;
    underline?: string | ThemeSet;
}

const styledCss = css`
    color: ${({ fontColor }: StyledProps) => fontColor ?? textColor};
    text-decoration: none;

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

const StyledLink = styled(RouterLink)`
    ${styledCss}
`;

const StyledALink = styled.a`
    ${styledCss}
`;

interface LinkProps {
    children: any;
    to?: string;
    href?: string;
    color?: string | ThemeSet;
    underline?: string | ThemeSet;
}

export const Link = ({ children, to, href, color, underline }: LinkProps) => {
    const props = { fontColor: color, underline };

    if (!to && !href) return null;

    if (to) {
        return (
            <StyledLink to={to} {...props}>
                {children}
            </StyledLink>
        );
    } else {
        return (
            <StyledALink href={href} {...props}>
                {children}
            </StyledALink>
        );
    }
};
