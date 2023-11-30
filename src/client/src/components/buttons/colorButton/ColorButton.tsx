import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { ChevronRight } from 'react-feather';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { ThemeSet } from 'styled-theming';
import {
  textColor,
  colorButtonBackground,
  disabledButtonBackground,
  disabledButtonBorder,
  disabledTextColor,
  colorButtonBorder,
  colorButtonBorderTwo,
  hoverTextColor,
  themeColors,
  mediaWidths,
} from '../../../styles/Themes';

interface GeneralProps {
  fullWidth?: boolean;
  mobileFullWidth?: boolean;
  buttonWidth?: string;
  withMargin?: string;
  mobileMargin?: string;
}

const GeneralButton = styled.button<GeneralProps>`
  min-height: 38px;
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  outline: none;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 14px;
  box-sizing: border-box;
  margin: ${({ withMargin }) => (withMargin ? withMargin : '0')};
  width: ${({ fullWidth, buttonWidth }) =>
    fullWidth ? '100%' : buttonWidth ? buttonWidth : 'auto'};

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
          : '0'};
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
`;

const StyledArrow = styled.div`
  margin: 0 -8px -5px 4px;
`;

interface BorderProps {
  borderColor?: string;
  selected?: boolean;
  withBorder?: boolean;
  backgroundColor?: string | ThemeSet;
}

const BorderButton = styled(GeneralButton)<BorderProps>`
  ${({ selected }) => selected && 'font-weight: 800'};
  background-color: ${({ backgroundColor }) =>
    backgroundColor || colorButtonBackground};
  color: ${textColor};
  border: 1px solid
    ${({ borderColor, selected, withBorder }) =>
      withBorder
        ? borderColor
          ? borderColor
          : colorButtonBorder
        : selected
          ? colorButtonBorder
          : colorButtonBorderTwo};

  &:hover {
    ${({ borderColor, selected }: BorderProps) =>
      !selected
        ? css`
            border: 1px solid ${colorButtonBackground};
            background-color: ${borderColor ? borderColor : colorButtonBorder};
            color: ${hoverTextColor};
          `
        : ''};
  }
`;

const DisabledButton = styled(GeneralButton)`
  border: none;
  background-color: ${disabledButtonBackground};
  color: ${disabledTextColor};
  border: 1px solid ${disabledButtonBorder};
  cursor: default;
`;

const renderArrow = () => (
  <StyledArrow>
    <ChevronRight size={18} />
  </StyledArrow>
);

export interface ColorButtonProps {
  loading?: boolean;
  color?: string;
  disabled?: boolean;
  selected?: boolean;
  arrow?: boolean;
  onClick?: () => void;
  withMargin?: string;
  mobileMargin?: string;
  withBorder?: boolean;
  fullWidth?: boolean;
  mobileFullWidth?: boolean;
  width?: string;
  backgroundColor?: string | ThemeSet;
  children?: ReactNode;
}

export const ColorButton: React.FC<ColorButtonProps> = ({
  loading,
  color,
  disabled,
  children,
  selected,
  arrow,
  withMargin,
  mobileMargin,
  withBorder,
  fullWidth,
  mobileFullWidth,
  width,
  onClick,
  backgroundColor,
}) => {
  if (disabled && !loading) {
    return (
      <DisabledButton
        withMargin={withMargin}
        mobileMargin={mobileMargin}
        fullWidth={fullWidth}
        mobileFullWidth={mobileFullWidth}
        buttonWidth={width}
      >
        {children}
        {arrow && renderArrow()}
      </DisabledButton>
    );
  }

  if (loading) {
    return (
      <DisabledButton
        withMargin={withMargin}
        mobileMargin={mobileMargin}
        fullWidth={fullWidth}
        mobileFullWidth={mobileFullWidth}
        buttonWidth={width}
      >
        <ScaleLoader height={16} color={themeColors.blue2} />
      </DisabledButton>
    );
  }

  return (
    <BorderButton
      borderColor={color}
      selected={selected}
      onClick={onClick}
      withMargin={withMargin}
      mobileMargin={mobileMargin}
      withBorder={withBorder}
      fullWidth={fullWidth}
      mobileFullWidth={mobileFullWidth}
      buttonWidth={width}
      backgroundColor={backgroundColor}
    >
      {children}
      {arrow && renderArrow()}
    </BorderButton>
  );
};
