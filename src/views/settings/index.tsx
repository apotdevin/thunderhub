import React from 'react';
import styled from 'styled-components';
import { SingleLine, SimpleButton } from '../../components/generic/Styled';
import { textColor } from '../../styles/Themes';
import { InterfaceSettings } from './Interface';
import { AccountSettings } from './Account';
import { DangerView } from './Danger';
import { CurrentSettings } from './Current';
import { SyncSettings } from './Sync';

export const ButtonRow = styled.div`
  width: auto;
  display: flex;
`;

export const SettingsLine = styled(SingleLine)`
  margin: 8px 0;
`;

export const SettingsButton = styled(SimpleButton)`
  padding: 8px;

  &:hover {
    border: 1px solid ${textColor};
  }
`;

const SettingsView = () => {
  return (
    <>
      <InterfaceSettings />
      <SyncSettings />
      <CurrentSettings />
      <AccountSettings />
      <DangerView />
    </>
  );
};

export default SettingsView;
