import React from 'react';
import styled from 'styled-components';
import {
    colorButtonBackground,
    buttonBorderColor,
    themeColors,
} from '../../styles/Themes';

const StyledContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-right: 32px;
    cursor: pointer;
`;

const FixedWidth = styled.div`
    height: 18px;
    width: 18px;
    margin: 0px;
    margin-right: 8px;
`;

const StyledCheckbox = styled.div`
    height: 16px;
    width: 16px;
    margin: 0;
    border: 1px solid ${buttonBorderColor};
    border-radius: 4px;
    outline: none;
    transition-duration: 0.3s;
    background-color: ${colorButtonBackground};
    box-sizing: border-box;
    border-radius: 50%;

    ${({ checked }: { checked: boolean }) =>
        checked && `background-color: ${themeColors.blue2}`}
`;

type CheckboxProps = {
    checked: boolean;
    onChange: (state: boolean) => void;
};

export const Checkbox: React.FC<CheckboxProps> = ({
    children,
    checked,
    onChange,
}) => {
    return (
        <StyledContainer onClick={() => onChange(!checked)}>
            <FixedWidth>
                <StyledCheckbox checked={checked} />
            </FixedWidth>
            {children}
        </StyledContainer>
    );
};
