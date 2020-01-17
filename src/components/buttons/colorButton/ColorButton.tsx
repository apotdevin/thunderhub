import React from 'react';
import styled from 'styled-components';
import {
    textColor,
    colorButtonBackground,
    colorButtonColor,
} from '../../../styles/Themes';
import { ChevronRight } from '../../generic/Icons';

const GeneralButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    outline: none;
    padding: 8px 16px;
    margin: 0 4px;
    text-decoration: none;
    border-radius: 8px;
    white-space: nowrap;
    font-size: 14px;
    box-sizing: border-box;
`;

const StyledArrow = styled.div`
    margin: 0 -8px -3px 4px;
`;

interface BorderProps {
    borderColor?: string;
    withHover?: boolean;
    selected?: boolean;
}

const BorderButton = styled(GeneralButton)`
    ${({ selected }) => selected && `cursor: default`}
    border: none;
    background-color: ${colorButtonBackground};
    color: ${({ selected }) => (selected ? textColor : colorButtonColor)};
    border: 1px solid
        ${({ borderColor, withHover, selected }: BorderProps) =>
            (borderColor && !withHover) || selected
                ? selected
                    ? '#595959'
                    : borderColor
                : colorButtonBackground};

    &:hover {
        color: ${textColor};
        ${({ borderColor, withHover, selected }: BorderProps) =>
            borderColor && withHover && !selected
                ? `border: 1px solid ${borderColor}`
                : ''};
    }
`;

const DisabledButton = styled(GeneralButton)`
    border: none;
    background-color: #262626;
    color: #8c8c8c;
    border: 1px solid #595959;
    cursor: default;
`;

interface ColorButtonProps {
    color?: string;
    disabled?: boolean;
    children?: any;
    selected?: boolean;
    arrow?: boolean;
    withHover?: boolean;
    onClick?: any;
}

const renderArrow = () => (
    <StyledArrow>
        <ChevronRight size={'18px'} />
    </StyledArrow>
);

export const ColorButton = ({
    color,
    disabled,
    children,
    selected,
    arrow,
    withHover = true,
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
            withHover={withHover}
            selected={selected}
            onClick={onClick}
        >
            {children}
            {arrow && renderArrow()}
        </BorderButton>
    );
};
