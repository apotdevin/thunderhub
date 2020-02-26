import { channels } from './channels';
import { invoices } from './invoices';
import { onChain } from './onchain';

export const mutation = { ...channels, ...invoices, ...onChain };
