import React from 'react';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { withApollo } from 'config/client';
import { BackupsView } from '../src/views/tools/backups/Backups';
import { MessagesView } from '../src/views/tools/messages/Messages';
import { WalletVersion } from '../src/views/tools/WalletVersion';

const ToolsView = () => (
  <>
    <BackupsView />
    <MessagesView />
    <WalletVersion />
  </>
);

const Wrapped = () => (
  <GridWrapper>
    <ToolsView />
  </GridWrapper>
);

export default withApollo(Wrapped);
