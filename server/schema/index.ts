import merge from 'lodash.merge';
import { makeExecutableSchema } from 'apollo-server-micro';
import { nodeTypes } from './node/types';
import { nodeResolvers } from './node/resolvers';
import { authResolvers } from './auth/resolvers';
import { generalTypes, queryTypes, mutationTypes } from './types';
import { accountResolvers } from './account/resolvers';
import { accountTypes } from './account/types';
import { hodlTypes } from './hodlhodl/types';
import { hodlResolvers } from './hodlhodl/resolvers';
import { lnpayResolvers } from './lnpay/resolvers';
import { lnpayTypes } from './lnpay/types';
import { bitcoinResolvers } from './bitcoin/resolvers';
import { bitcoinTypes } from './bitcoin/types';
import { peerTypes } from './peer/types';
import { peerResolvers } from './peer/resolvers';
import { routeResolvers } from './route/resolvers';
import { chainTypes } from './chain/types';
import { chainResolvers } from './chain/resolvers';
import { toolsResolvers } from './tools/resolvers';
import { toolsTypes } from './tools/types';
import { chatTypes } from './chat/types';
import { chatResolvers } from './chat/resolvers';
import { widgetResolvers } from './widgets/resolvers';
import { widgetTypes } from './widgets/types';
import { invoiceResolvers } from './invoice/resolvers';
import { channelResolvers } from './channel/resolvers';
import { walletResolvers } from './wallet/resolvers';
import { transactionResolvers } from './transactions/resolvers';
import { channelTypes } from './channel/types';
import { walletTypes } from './wallet/types';
import { invoiceTypes } from './invoice/types';
import { networkTypes } from './network/types';
import { transactionTypes } from './transactions/types';

const typeDefs = [
  generalTypes,
  queryTypes,
  mutationTypes,
  nodeTypes,
  accountTypes,
  hodlTypes,
  lnpayTypes,
  bitcoinTypes,
  peerTypes,
  chainTypes,
  toolsTypes,
  chatTypes,
  widgetTypes,
  channelTypes,
  walletTypes,
  invoiceTypes,
  networkTypes,
  transactionTypes,
];

const resolvers = merge(
  nodeResolvers,
  authResolvers,
  accountResolvers,
  hodlResolvers,
  lnpayResolvers,
  bitcoinResolvers,
  peerResolvers,
  routeResolvers,
  chainResolvers,
  toolsResolvers,
  chatResolvers,
  widgetResolvers,
  invoiceResolvers,
  channelResolvers,
  walletResolvers,
  transactionResolvers
);

export default makeExecutableSchema({ typeDefs, resolvers });
