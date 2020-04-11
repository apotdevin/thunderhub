import React, { useState } from 'react';
import { getConfigLnd } from '../../../utils/auth';
import { toast } from 'react-toastify';
import { Input } from '../../input/Input';
import { Line, StyledTitle } from '../Auth.styled';
import { RiskCheckboxAndConfirm } from './Checkboxes';

interface AuthProps {
  handleSet: ({
    host,
    admin,
    viewOnly,
    cert,
  }: {
    host?: string;
    admin?: string;
    viewOnly?: string;
    cert?: string;
  }) => void;
}

export const BTCLoginForm = ({ handleSet }: AuthProps) => {
  const [json, setJson] = useState('');
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    try {
      JSON.parse(json);
      const { cert, admin, viewOnly, host } = getConfigLnd(json);
      handleSet({ host, admin, viewOnly, cert });
    } catch (error) {
      toast.error('Invalid JSON');
    }
  };

  const canConnect = json !== '' && checked;
  return (
    <>
      <Line>
        <StyledTitle>BTCPayServer Connect JSON:</StyledTitle>
        <Input onChange={e => setJson(e.target.value)} />
      </Line>
      <RiskCheckboxAndConfirm
        disabled={!canConnect}
        handleClick={handleClick}
        checked={checked}
        onChange={setChecked}
      />
    </>
  );
};
