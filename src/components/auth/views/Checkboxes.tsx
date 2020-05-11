import React from 'react';
import { Checkbox } from '../../checkbox/Checkbox';
import { CheckboxText } from '../Auth.styled';
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
        {`I'm feeling reckless. Lightning, LND and ThunderHub are under constant development and I understand that there is always a risk of losing funds.`}
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
  </>
);
