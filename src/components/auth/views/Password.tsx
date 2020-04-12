import React from 'react';
import { Sub4Title, SubTitle } from '../../generic/Styled';
import zxcvbn from 'zxcvbn';
import { ColorButton } from '../../buttons/colorButton/ColorButton';
import { Input } from '../../input/Input';
import { Line } from '../Auth.styled';
import { LoadingBar } from '../../loadingBar/LoadingBar';

interface PasswordProps {
  isPass?: string;
  setPass: (pass: string) => void;
  callback: () => void;
  loading: boolean;
}

const PasswordInput = ({
  isPass = '',
  setPass,
  callback,
  loading = false,
}: PasswordProps) => {
  const strength = (100 * Math.min(zxcvbn(isPass).guesses_log10, 40)) / 40;
  const needed = process.env.NODE_ENV === 'development' ? 1 : 20;
  return (
    <>
      <SubTitle>Please Input a Password</SubTitle>
      <Line>
        <Sub4Title>Password:</Sub4Title>
        <Input onChange={e => setPass(e.target.value)} />
      </Line>
      <Line>
        <Sub4Title>Strength:</Sub4Title>
        <LoadingBar percent={strength} />
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
