import React from 'react';
import { Checkbox } from '../../checkbox/Checkbox';
import { CheckboxText, StyledContainer, FixedWidth } from '../Auth.styled';
import { AlertCircle } from '../../generic/Icons';
import { fontColors } from '../../../styles/Themes';
import { ColorButton } from '../../buttons/colorButton/ColorButton';

type CheckboxProps = {
  handleClick: () => void;
  disabled: boolean;
  checked: boolean;
  onChange: (state: boolean) => void;
};

export const RiskCheckboxAndConfirm = ({
  handleClick,
  disabled,
  checked,
  onChange,
}: CheckboxProps) => (
  <>
    <Checkbox checked={checked} onChange={onChange}>
      <CheckboxText>
        I'm feeling reckless - I understand that Lightning, LND and ThunderHub
        are under constant development and that there is always a risk of losing
        funds.
      </CheckboxText>
    </Checkbox>
    <ColorButton
      disabled={disabled}
      onClick={handleClick}
      withMargin={'32px 0 0'}
      fullWidth={true}
      arrow={true}
    >
      Connect
    </ColorButton>
    <WarningBox />
  </>
);

export const WarningBox = () => {
  return (
    <StyledContainer>
      <FixedWidth>
        <AlertCircle color={fontColors.grey7} />
      </FixedWidth>
      <CheckboxText>
        Macaroons are handled by the ThunderHub server to connect to your LND
        node but are never stored. Still, this involves a certain degree of
        trust you must be aware of.
      </CheckboxText>
    </StyledContainer>
  );
};
