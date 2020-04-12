import { channelQueries } from './channels';
import { generalQueries } from './general';
import { invoiceQueries } from './transactions';
import { dataQueries } from './data';
import { reportQueries } from './report';
import { flowQueries } from './flow';
import { backupQueries } from './backup';
import { routeQueries } from './route';
import { peerQueries } from './peer';
import { messageQueries } from './message';
import { chainQueries } from './chain';
import { hodlQueries } from './hodlhodl';

export const query = {
  ...channelQueries,
  ...generalQueries,
  ...invoiceQueries,
  ...dataQueries,
  ...reportQueries,
  ...flowQueries,
  ...backupQueries,
  ...routeQueries,
  ...peerQueries,
  ...messageQueries,
  ...chainQueries,
  ...hodlQueries,
};
