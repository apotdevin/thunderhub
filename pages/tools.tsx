import React from 'react';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { withApollo } from 'config/client';
import { Bakery } from 'src/views/tools/bakery/Bakery';
import { BackupsView } from '../src/views/tools/backups/Backups';
import { MessagesView } from '../src/views/tools/messages/Messages';
import { WalletVersion } from '../src/views/tools/WalletVersion';

const ToolsView = () => (
  <>
    <BackupsView />
    <MessagesView />
    <Bakery />
    <WalletVersion />
  </>
);

const Wrapped = () => (
  <GridWrapper>
    <ToolsView />
  </GridWrapper>
);

export default withApollo(Wrapped);
