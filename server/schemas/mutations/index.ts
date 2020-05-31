import { channels } from './channels';
import { invoices } from './invoices';
import { onChain } from './onchain';
import { peers } from './peers';
import { chat } from './chat';
import { authTokenMutations } from './authToken';

export const mutation = {
  ...channels,
  ...invoices,
  ...onChain,
  ...peers,
  ...chat,
  ...authTokenMutations,
};
