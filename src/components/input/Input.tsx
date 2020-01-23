import React from 'react';
import styled from 'styled-components';
import { textColor } from '../../styles/Themes';

interface InputProps {
    color?: string;
}

export const StyledInput = styled.input`
    padding: 5px;
    height: 30px;
    width: 100%;
    margin: 8px 0;
    border: 1px solid #c8ccd4;
    background: none;
    border-radius: 5px;
    color: ${textColor};
    transition: all 0.5s ease;

    &:hover {
        border: 1px solid
            ${({ color }: InputProps) => (color ? color : '#0077ff')};
    }

    &:focus {
        outline: none;
        background: none;
        border: 1px solid
            ${({ color }: InputProps) => (color ? color : '#0077ff')};
    }
`;

export const Input = () => {
    return <div>Hello</div>;
};
