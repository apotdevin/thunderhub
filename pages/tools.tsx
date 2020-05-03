import React from 'react';
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

export default ToolsView;
