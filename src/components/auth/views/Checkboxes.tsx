import React from 'react';
import { Checkbox } from '../../checkbox/Checkbox';
import { CheckboxText, StyledContainer, FixedWidth } from '../Auth.styled';
import { AlertCircle } from 'react-feather';
import { fontColors } from '../../../styles/Themes';
import { ColorButton } from '../../buttons/colorButton/ColorButton';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { trustNeeded } = publicRuntimeConfig;

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
        I'm feeling reckless. Lightning, LND and ThunderHub are under constant
        development and I understand that there is always a risk of losing
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
  if (!trustNeeded) {
    return null;
  }
  return (
    <StyledContainer>
      <FixedWidth>
        <AlertCircle size={18} color={fontColors.grey7} />
      </FixedWidth>
      <CheckboxText>
        Macaroons are handled by the ThunderHub server to connect to your LND
        node but are never stored. Still, this involves a certain degree of
        trust you must be aware of.
      </CheckboxText>
    </StyledContainer>
  );
};
