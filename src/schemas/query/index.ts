import { channelQueries } from './channels';
import { generalQueries } from './general';
import { invoiceQueries } from './transactions';
import { dataQueries } from './data';
import { reportQueries } from './report';
import { flowQueries } from './flow';
import { backupQueries } from './backup';
import { routeQueries } from './route';

export const query = {
    ...channelQueries,
    ...generalQueries,
    ...invoiceQueries,
    ...dataQueries,
    ...reportQueries,
    ...flowQueries,
    ...backupQueries,
    ...routeQueries,
};
