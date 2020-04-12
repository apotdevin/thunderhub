import React from 'react';
import styled, { css } from 'styled-components';
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
} from '../../../styles/Themes';
import { ChevronRight } from '../../generic/Icons';
import ScaleLoader from 'react-spinners/ScaleLoader';

interface GeneralProps {
  fullWidth?: boolean;
  buttonWidth?: string;
  withMargin?: string;
}

const GeneralButton = styled.button`
  display: flex;
  justify-content: center;
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
  width: ${({ fullWidth, buttonWidth }: GeneralProps) =>
    fullWidth ? '100%' : buttonWidth ? buttonWidth : 'auto'};
`;

const StyledArrow = styled.div`
  margin: 0 -8px -5px 4px;
`;

interface BorderProps {
  borderColor?: string;
  selected?: boolean;
  withBorder?: boolean;
}

const BorderButton = styled(GeneralButton)`
  ${({ selected }) => selected && 'cursor: default'};
  ${({ selected }) => selected && 'font-weight: 900'};
  background-color: ${colorButtonBackground};
  color: ${textColor};
  border: 1px solid
    ${({ borderColor, selected, withBorder }: BorderProps) =>
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
    <ChevronRight size={'18px'} />
  </StyledArrow>
);

export interface ColorButtonProps {
  loading?: boolean;
  color?: string;
  disabled?: boolean;
  children?: any;
  selected?: boolean;
  arrow?: boolean;
  onClick?: any;
  withMargin?: string;
  withBorder?: boolean;
  fullWidth?: boolean;
  width?: string;
}

export const ColorButton = ({
  loading,
  color,
  disabled,
  children,
  selected,
  arrow,
  withMargin,
  withBorder,
  fullWidth,
  width,
  onClick,
}: ColorButtonProps) => {
  if (disabled && !loading) {
    return (
      <DisabledButton
        withMargin={withMargin}
        fullWidth={fullWidth}
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
        fullWidth={fullWidth}
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
      withBorder={withBorder}
      fullWidth={fullWidth}
      buttonWidth={width}
    >
      {children}
      {arrow && renderArrow()}
    </BorderButton>
  );
};
