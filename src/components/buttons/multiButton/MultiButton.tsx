import React from 'react';
import styled, { css } from 'styled-components';
import {
  multiSelectColor,
  colorButtonBorder,
  multiButtonColor,
} from '../../../styles/Themes';

interface StyledSingleProps {
  selected?: boolean;
  buttonColor?: string;
}

const StyledSingleButton = styled.button<StyledSingleProps>`
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  border: none;
  text-decoration: none;
  padding: 8px 16px;
  background-color: transparent;
  color: ${multiSelectColor};
  flex-grow: 1;

  ${({ selected, buttonColor }) =>
    selected
      ? css`
          color: white;
          background-color: ${buttonColor ? buttonColor : colorButtonBorder};
        `
      : ''};
`;

interface SingleButtonProps {
  children: any;
  selected?: boolean;
  color?: string;
  onClick?: () => void;
}

export const SingleButton = ({
  children,
  selected,
  color,
  onClick,
}: SingleButtonProps) => {
  return (
    <StyledSingleButton
      selected={selected}
      buttonColor={color}
      onClick={() => {
        onClick && onClick();
      }}
    >
      {children}
    </StyledSingleButton>
  );
};

interface MultiBackProps {
  margin?: string;
}

const MultiBackground = styled.div<MultiBackProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  padding: 4px;
  background: ${multiButtonColor};
  flex-wrap: wrap;

  ${({ margin }) => margin && `margin: ${margin}`}
`;

interface MultiButtonProps {
  children: any;
  margin?: string;
}

export const MultiButton = ({ children, margin }: MultiButtonProps) => {
  return <MultiBackground margin={margin}>{children}</MultiBackground>;
};
