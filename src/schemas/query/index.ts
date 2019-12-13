import { channelQueries } from './channels';
import { generalQueries } from './general';
import { invoiceQueries } from './invoices';
import { dataQueries } from './data';
import { reportQueries } from './report';
import { flowQueries } from './flow';
import { routeQueries } from './route';

export const query = {
    ...channelQueries,
    ...generalQueries,
    ...invoiceQueries,
    ...dataQueries,
    ...reportQueries,
    ...flowQueries,
    ...routeQueries,
};
