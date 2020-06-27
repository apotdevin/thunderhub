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
  transition: background-color 0.5s ease;

  ${({ selected, buttonColor }) =>
    selected
      ? css`
          color: white;
          background-color: ${buttonColor ? buttonColor : colorButtonBorder};
        `
      : ''};
`;

interface SingleButtonProps {
  selected?: boolean;
  color?: string;
  onClick?: () => void;
}

export const SingleButton: React.FC<SingleButtonProps> = ({
  children,
  selected,
  color,
  onClick,
}) => {
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
  margin?: string;
}

export const MultiButton: React.FC<MultiButtonProps> = ({
  children,
  margin,
}) => {
  return <MultiBackground margin={margin}>{children}</MultiBackground>;
};
