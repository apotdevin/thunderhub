import React from 'react';
import styled, { css } from 'styled-components';
import { textColor, linkHighlight } from '../../styles/Themes';
import { ThemeSet } from 'styled-theming';
import { Link as RouterLink } from 'react-router-dom';

interface StyledProps {
    fontColor?: string | ThemeSet;
    underline?: string | ThemeSet;
    inheritColor?: boolean;
    fullWidth?: boolean;
}

const styledCss = css`
    color: ${({ fontColor, inheritColor }: StyledProps) =>
        inheritColor ? 'inherit' : fontColor ?? textColor};
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

const StyledLink = styled(
    ({ inheritColor, fontColor, underline, fullWidth, ...rest }) => (
        <RouterLink {...rest} />
    ),
)(() => styledCss);

const StyledALink = styled.a`
    ${styledCss}
`;

interface LinkProps {
    children: any;
    to?: string;
    href?: string;
    color?: string | ThemeSet;
    underline?: string | ThemeSet;
    inheritColor?: boolean;
    fullWidth?: boolean;
}

export const Link = ({
    children,
    to,
    href,
    color,
    underline,
    inheritColor,
    fullWidth,
}: LinkProps) => {
    const props = { fontColor: color, underline, inheritColor, fullWidth };

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
