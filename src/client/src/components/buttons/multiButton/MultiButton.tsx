import { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import {
  multiSelectColor,
  colorButtonBorder,
  multiButtonColor,
  themeColors,
} from '../../../styles/Themes';
import { Loader2 } from 'lucide-react';

interface StyledSingleProps {
  selected?: boolean;
  buttonColor?: string;
  withPadding?: string;
}

const StyledSingleButton = styled.button<StyledSingleProps>`
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  border: none;
  text-decoration: none;
  padding: ${({ withPadding }) => (withPadding ? withPadding : '8px 16px')};
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
  disabled?: boolean;
  selected?: boolean;
  color?: string;
  withPadding?: string;
  onClick?: () => void;
  children?: ReactNode;
}

export const SingleButton: FC<SingleButtonProps> = ({
  children,
  disabled,
  selected,
  color,
  withPadding,
  onClick,
}) => {
  return (
    <StyledSingleButton
      disabled={disabled}
      selected={selected}
      buttonColor={color}
      withPadding={withPadding}
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
  loading?: boolean;
  width?: string;
  children?: ReactNode;
}

export const MultiButton: FC<MultiButtonProps> = ({
  children,
  margin,
  loading,
  width = 'auto',
}) => {
  return (
    <MultiBackground margin={margin}>
      {loading ? (
        <div style={{ width, textAlign: 'center' }}>
          <Loader2
            className="animate-spin"
            size={21}
            style={{ color: themeColors.blue3 }}
          />
        </div>
      ) : (
        children
      )}
    </MultiBackground>
  );
};
