import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { Bakery } from '../views/tools/bakery/Bakery';
import { BackupsView } from '../views/tools/backups/Backups';
import { MessagesView } from '../views/tools/messages/Messages';
import { WalletVersion } from '../views/tools/WalletVersion';

const ToolsView = () => (
  <>
    <BackupsView />
    <MessagesView />
    <Bakery />
    <WalletVersion />
  </>
);

const ToolsPage = () => (
  <GridWrapper>
    <ToolsView />
  </GridWrapper>
);

export default ToolsPage;
