import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { AccessIds } from '../views/tools/accessIds/AccessIds';
import { Bakery } from '../views/tools/bakery/Bakery';
import { BackupsView } from '../views/tools/backups/Backups';
import { MessagesView } from '../views/tools/messages/Messages';
import { WalletVersion } from '../views/tools/WalletVersion';

const ToolsView = () => (
  <div className="flex flex-col gap-6">
    <BackupsView />
    <MessagesView />
    <Bakery />
    <AccessIds />
    <WalletVersion />
  </div>
);

const ToolsPage = () => (
  <GridWrapper centerContent={false}>
    <ToolsView />
  </GridWrapper>
);

export default ToolsPage;
