import { channelQueries } from './channels';
import { generalQueries } from './general';
import { invoiceQueries } from './invoices';
import { dataQueries } from './data';
import { reportQueries } from './report';
import { flowQueries } from './flow';
import { backupQueries } from './backup';

export const query = {
    ...channelQueries,
    ...generalQueries,
    ...invoiceQueries,
    ...dataQueries,
    ...reportQueries,
    ...flowQueries,
    ...backupQueries,
};
