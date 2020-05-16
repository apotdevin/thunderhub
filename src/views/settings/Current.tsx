import React from 'react';
import styled from 'styled-components';
import { useAccountState, CLIENT_ACCOUNT } from 'src/context/AccountContext';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
} from '../../components/generic/Styled';
import { chartLinkColor, colorButtonBackground } from '../../styles/Themes';

const CurrentField = styled.textarea`
  width: 100%;
  color: ${chartLinkColor};
  margin: 10px 0;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: ${colorButtonBackground};
  border: none;
  word-wrap: break-word;
  resize: none;
`;

export const CurrentSettings = () => {
  const { account } = useAccountState();

  if (account?.type !== CLIENT_ACCOUNT) {
    return null;
  }

  const { name, host, viewOnly, admin, cert } = account;

  const renderField = (title: string, field: string | null, rows?: number) => {
    if (!field) return null;

    return (
      <>
        <Sub4Title>{title}</Sub4Title>
        <CurrentField rows={rows ?? 3} readOnly={true} value={field} />
      </>
    );
  };

  if (admin === '' && viewOnly === '') {
    return null;
  }

  return (
    <CardWithTitle>
      <SubTitle>Current Account:</SubTitle>
      <Card>
        {renderField('Name:', name, 2)}
        {renderField('Host:', host, 2)}
        {renderField('AES-256 Encrypted Admin Macaroon:', admin)}
        {renderField('Read-only Macaroon:', viewOnly)}
        {renderField('Certificate:', cert)}
      </Card>
    </CardWithTitle>
  );
};
