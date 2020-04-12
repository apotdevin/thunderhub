import React from 'react';
import styled, { css } from 'styled-components';
import {
  textColor,
  colorButtonBorder,
  inputBackgroundColor,
  inputBorderColor,
} from '../../styles/Themes';

interface InputProps {
  color?: string;
  withMargin?: string;
  fullWidth?: boolean;
  inputWidth?: string;
  maxWidth?: string;
}

export const StyledInput = styled.input`
    padding: 5px;
    height: 30px;
    margin: 8px 0;
    border: 1px solid ${inputBorderColor};
    background: none;
    border-radius: 5px;
    color: ${textColor};
    transition: all 0.5s ease;
    background-color: ${inputBackgroundColor};
    ${({ maxWidth }: InputProps) =>
      maxWidth &&
      css`
        max-width: ${maxWidth};
      `}
    width: ${({ fullWidth, inputWidth }: InputProps) =>
      fullWidth ? '100%' : inputWidth ? inputWidth : 'auto'};
    margin: ${({ withMargin }) => (withMargin ? withMargin : '0')};

    &:hover {
        border: 1px solid
            ${({ color }: InputProps) => (color ? color : colorButtonBorder)};
    }

    &:focus {
        outline: none;
        border: 1px solid
            ${({ color }: InputProps) => (color ? color : colorButtonBorder)};
    }
`;

interface InputCompProps {
  type?: string;
  value?: number | string;
  placeholder?: string;
  color?: string;
  withMargin?: string;
  fullWidth?: boolean;
  width?: string;
  maxWidth?: string;
  onChange: (e: any) => void;
}

export const Input = ({
  type,
  value,
  placeholder,
  color,
  withMargin,
  fullWidth = true,
  width,
  maxWidth,
  onChange,
}: InputCompProps) => {
  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      value={value}
      color={color}
      withMargin={withMargin}
      onChange={e => onChange(e)}
      fullWidth={fullWidth}
      inputWidth={width}
      maxWidth={maxWidth}
    />
  );
};
