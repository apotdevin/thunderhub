import React from 'react';
import styled from 'styled-components';
import { GridWrapper } from '../../src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from '../../src/utils/ssr';
import { DashboardSettings } from '../../src/views/settings/Dashboard';
import { SingleLine } from '../../src/components/generic/Styled';
import { InterfaceSettings } from '../../src/views/settings/Interface';
import { DangerView } from '../../src/views/settings/Danger';
import { ChatSettings } from '../../src/views/settings/Chat';
import { PrivacySettings } from '../../src/views/settings/Privacy';

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
      <DashboardSettings />
      <PrivacySettings />
      <ChatSettings />
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

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
