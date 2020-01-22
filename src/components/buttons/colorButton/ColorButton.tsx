import React from 'react';
import styled, { css } from 'styled-components';
import {
    textColor,
    colorButtonBackground,
    disabledButtonBackground,
    disabledButtonBorder,
    disabledTextColor,
    colorButtonBorder,
    hoverTextColor,
} from '../../../styles/Themes';
import { ChevronRight } from '../../generic/Icons';

const GeneralButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    outline: none;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 8px;
    white-space: nowrap;
    font-size: 14px;
    box-sizing: border-box;
    width: 100%;
`;

const StyledArrow = styled.div`
    margin: 0 -8px -5px 4px;
`;

interface BorderProps {
    borderColor?: string;
    selected?: boolean;
    withMargin?: string;
    withBorder?: boolean;
}

const BorderButton = styled(GeneralButton)`
    margin: ${({ withMargin }) => (withMargin ? withMargin : '0')};
    ${({ selected }) => selected && `cursor: default`};
    ${({ selected }) => selected && `font-weight: 900`};
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
                : colorButtonBackground};

    &:hover {
        ${({ borderColor, selected }: BorderProps) =>
            !selected
                ? css`
                      border: 1px solid ${colorButtonBackground};
                      background-color: ${borderColor
                          ? borderColor
                          : colorButtonBorder};
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

interface ColorButtonProps {
    color?: string;
    disabled?: boolean;
    children?: any;
    selected?: boolean;
    arrow?: boolean;
    onClick?: any;
    withMargin?: string;
    withBorder?: boolean;
}

export const ColorButton = ({
    color,
    disabled,
    children,
    selected,
    arrow,
    withMargin,
    withBorder,
    onClick,
}: ColorButtonProps) => {
    if (disabled) {
        return (
            <DisabledButton>
                {children}
                {arrow && renderArrow()}
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
        >
            {children}
            {arrow && renderArrow()}
        </BorderButton>
    );
};
