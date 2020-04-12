import React, { useState } from 'react';
import { getAuthLnd, getBase64CertfromDerFormat } from '../../../utils/auth';
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

export const ConnectLoginForm = ({ handleSet }: AuthProps) => {
  const [url, setUrl] = useState('');
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    const { cert, macaroon, socket } = getAuthLnd(url);
    const base64Cert = getBase64CertfromDerFormat(cert) || '';

    handleSet({
      host: socket,
      admin: macaroon,
      cert: base64Cert,
    });
  };

  const canConnect = url !== '' && checked;

  return (
    <>
      <Line>
        <StyledTitle>LND Connect Url:</StyledTitle>
        <Input onChange={e => setUrl(e.target.value)} />
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
