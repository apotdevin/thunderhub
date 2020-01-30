import React from 'react';
import styled from 'styled-components';
import { textColor, linkHighlight } from '../../styles/Themes';

const StyledLink = styled.a`
    color: ${textColor};
    cursor: pointer;
    padding: 2px 2px 1px;
    background: linear-gradient(
        to bottom,
        ${linkHighlight} 0%,
        ${linkHighlight} 100%
    );
    background-position: 0 100%;
    background-repeat: repeat-x;
    background-size: 2px 2px;
    text-decoration: none;
    transition: background-size 0.5s;

    :hover {
        background-size: 4px 50px;
    }
`;

interface LinkProps {
    children: any;
    to: string;
}

export const Link = ({ children, to }: LinkProps) => {
    return <StyledLink href={to}>{children}</StyledLink>;
};
