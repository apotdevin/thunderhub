import React, { useState } from 'react';
import { Sub4Title, SubTitle, DarkSubTitle } from '../../generic/Styled';
import zxcvbn from 'zxcvbn';
import { ColorButton } from '../../buttons/colorButton/ColorButton';
import { Input } from '../../input/Input';
import { Line, CheckboxText } from '../Auth.styled';
import { LoadingBar } from '../../loadingBar/LoadingBar';
import { Checkbox } from '../../checkbox/Checkbox';
import getConfig from 'next/config';

interface PasswordProps {
  isPass?: string;
  setPass: (pass: string) => void;
  callback: () => void;
  loading: boolean;
}

const { publicRuntimeConfig } = getConfig();
const { nodeEnv } = publicRuntimeConfig;

const PasswordInput = ({
  isPass = '',
  setPass,
  callback,
  loading = false,
}: PasswordProps) => {
  const [checked, setChecked] = useState(false);
  const strength = (100 * Math.min(zxcvbn(isPass).guesses_log10, 40)) / 40;
  const needed = nodeEnv === 'development' ? 1 : checked ? 10 : 20;

  return (
    <>
      <SubTitle>Please Input a Password</SubTitle>
      <DarkSubTitle>
        This password will be used to encrypt your admin macaroon.
      </DarkSubTitle>
      <Line>
        <Sub4Title>Password:</Sub4Title>
        <Input onChange={e => setPass(e.target.value)} />
      </Line>
      <Line>
        <Sub4Title>Strength:</Sub4Title>
        <LoadingBar percent={strength} />
      </Line>
      <Line>
        <Checkbox checked={checked} onChange={setChecked}>
          <CheckboxText>
            {'Disable Strong Password Check (Not Recommended)'}
          </CheckboxText>
        </Checkbox>
      </Line>
      <ColorButton
        disabled={strength < needed}
        onClick={callback}
        withMargin={'32px 0 0'}
        fullWidth={true}
        arrow={true}
        loading={loading}
      >
        Connect
      </ColorButton>
    </>
  );
};

export default PasswordInput;
