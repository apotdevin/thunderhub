import React, { useState } from 'react';
import { Input } from '../../input/Input';
import { Line, StyledTitle } from '../Auth.styled';
import { SingleLine, Sub4Title } from '../../generic/Styled';
import {
  MultiButton,
  SingleButton,
} from '../../buttons/multiButton/MultiButton';
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

export const LoginForm = ({ handleSet }: AuthProps) => {
  const [isViewOnly, setIsViewOnly] = useState(true);
  const [checked, setChecked] = useState(false);

  const [host, setHost] = useState('');
  const [admin, setAdmin] = useState('');
  const [viewOnly, setRead] = useState('');
  const [cert, setCert] = useState('');

  const handleClick = () => {
    handleSet({ host, admin, viewOnly, cert });
  };

  const canConnect =
    host !== '' && (admin !== '' || viewOnly !== '') && checked;
  return (
    <>
      <SingleLine>
        <Sub4Title>Type of Account:</Sub4Title>
        <MultiButton>
          <SingleButton
            selected={isViewOnly}
            onClick={() => setIsViewOnly(true)}
          >
            ViewOnly
          </SingleButton>
          <SingleButton
            selected={!isViewOnly}
            onClick={() => setIsViewOnly(false)}
          >
            Admin
          </SingleButton>
        </MultiButton>
      </SingleLine>
      <Line>
        <StyledTitle>Host:</StyledTitle>
        <Input
          placeholder={'Url and port (e.g.: www.node.com:443)'}
          onChange={e => setHost(e.target.value)}
        />
      </Line>
      {!isViewOnly && (
        <Line>
          <StyledTitle>Admin:</StyledTitle>
          <Input
            placeholder={'Base64 or HEX Admin macaroon'}
            onChange={e => setAdmin(e.target.value)}
          />
        </Line>
      )}
      <Line>
        <StyledTitle>Readonly:</StyledTitle>
        <Input
          placeholder={'Base64 or HEX Readonly macaroon'}
          onChange={e => setRead(e.target.value)}
        />
      </Line>
      <Line>
        <StyledTitle>Certificate:</StyledTitle>
        <Input
          placeholder={'Base64 or HEX TLS Certificate'}
          onChange={e => setCert(e.target.value)}
        />
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
