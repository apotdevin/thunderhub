import React from 'react';
import styled, { css } from 'styled-components';
import {
  textColor,
  colorButtonBorder,
  inputBackgroundColor,
  inputBorderColor,
  mediaWidths,
} from '../../styles/Themes';

interface InputProps {
  color?: string;
  withMargin?: string;
  mobileMargin?: string;
  fullWidth?: boolean;
  mobileFullWidth?: boolean;
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
    width: ${({ fullWidth }: InputProps) => (fullWidth ? '100%' : 'auto')};
    margin: ${({ withMargin }) => (withMargin ? withMargin : '0')};

    @media (${mediaWidths.mobile}) {
    ${({ withMargin, mobileMargin }) =>
      mobileMargin
        ? css`
            margin: ${mobileMargin};
          `
        : withMargin
        ? css`
            margin: ${withMargin};
          `
        : ''};
    ${({ fullWidth, mobileFullWidth }) =>
      mobileFullWidth
        ? css`
            width: 100%;
          `
        : fullWidth
        ? css`
            width: 100%;
          `
        : ''};
  }

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
  mobileMargin?: string;
  fullWidth?: boolean;
  mobileFullWidth?: boolean;
  maxWidth?: string;
  onChange: (e: any) => void;
}

export const Input = ({
  type,
  value,
  placeholder,
  color,
  withMargin,
  mobileMargin,
  mobileFullWidth,
  fullWidth = true,
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
      mobileMargin={mobileMargin}
      onChange={e => onChange(e)}
      fullWidth={fullWidth}
      mobileFullWidth={mobileFullWidth}
      maxWidth={maxWidth}
    />
  );
};
