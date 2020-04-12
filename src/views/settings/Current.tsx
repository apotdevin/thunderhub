import React from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
} from '../../components/generic/Styled';
import styled from 'styled-components';
import { chartLinkColor, colorButtonBackground } from '../../styles/Themes';
import { useAccount } from '../../context/AccountContext';

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
  const { name, host, admin, viewOnly, cert } = useAccount();

  const renderField = (title: string, field: string | null, rows?: number) => {
    if (!field) return null;

    return (
      <>
        <Sub4Title>{title}</Sub4Title>
        <CurrentField rows={rows ?? 3} readOnly={true} value={field} />
      </>
    );
  };

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
