import { channels } from './channels';
import { invoices } from './invoices';
import { onChain } from './onchain';
import { peers } from './peers';

export const mutation = {
    ...channels,
    ...invoices,
    ...onChain,
    ...peers,
};
