import React from 'react';
import styled from 'styled-components';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { SingleLine } from '../src/components/generic/Styled';
import { InterfaceSettings } from '../src/views/settings/Interface';
import { AccountSettings } from '../src/views/settings/Account';
import { DangerView } from '../src/views/settings/Danger';
import { ChatSettings } from '../src/views/settings/Chat';
import { PrivacySettings } from '../src/views/settings/Privacy';

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
      <PrivacySettings />
      <ChatSettings />
      <AccountSettings />
      <DangerView />
    </>
  );
};

const Wrapped = () => (
  <GridWrapper noNavigation={true}>
    <SettingsView />
  </GridWrapper>
);

export default Wrapped;
