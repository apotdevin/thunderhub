import React from 'react';
import styled from 'styled-components';
import { SingleLine } from '../../components/generic/Styled';
import { InterfaceSettings } from './Interface';
import { AccountSettings } from './Account';
import { DangerView } from './Danger';

export const ButtonRow = styled.div`
  width: auto;
  display: flex;
`;

export const SettingsLine = styled(SingleLine)`
  margin: 8px 0;
`;

const SettingsView = () => {
  return (
    <>
      <InterfaceSettings />
      <AccountSettings />
      <DangerView />
    </>
  );
};

export default SettingsView;
