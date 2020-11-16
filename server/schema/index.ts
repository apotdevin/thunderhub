import merge from 'lodash.merge';
import { makeExecutableSchema } from 'graphql-tools';
import { nodeTypes } from './node/types';
import { nodeResolvers } from './node/resolvers';
import { authResolvers } from './auth/resolvers';
import { generalTypes, queryTypes, mutationTypes } from './types';
import { accountResolvers } from './account/resolvers';
import { accountTypes } from './account/types';
import { bitcoinResolvers } from './bitcoin/resolvers';
import { bitcoinTypes } from './bitcoin/types';
import { peerTypes } from './peer/types';
import { peerResolvers } from './peer/resolvers';
import { routeResolvers } from './route/resolvers';
import { chainTypes } from './chain/types';
import { chainResolvers } from './chain/resolvers';
import { toolsResolvers } from './tools/resolvers';
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
import { healthResolvers } from './health/resolvers';
import { healthTypes } from './health/types';
import { githubResolvers } from './github/resolvers';
import { routeTypes } from './route/types';
import { generalResolvers } from './resolvers';
import { macaroonResolvers } from './macaroon/resolvers';
import { networkResolvers } from './network/resolvers';
import { bosResolvers } from './bos/resolvers';
import { bosTypes } from './bos/types';
import { tbaseResolvers } from './tbase/resolvers';
import { tbaseTypes } from './tbase/types';
import { lnUrlResolvers } from './lnurl/resolvers';
import { lnUrlTypes } from './lnurl/types';
import { lnMarketsResolvers } from './lnmarkets/resolvers';
import { lnMarketsTypes } from './lnmarkets/types';

const typeDefs = [
  generalTypes,
  queryTypes,
  mutationTypes,
  nodeTypes,
  accountTypes,
  bitcoinTypes,
  peerTypes,
  chainTypes,
  chatTypes,
  widgetTypes,
  channelTypes,
  walletTypes,
  invoiceTypes,
  networkTypes,
  transactionTypes,
  healthTypes,
  routeTypes,
  bosTypes,
  tbaseTypes,
  lnUrlTypes,
  lnMarketsTypes,
];

const resolvers = merge(
  generalResolvers,
  nodeResolvers,
  authResolvers,
  accountResolvers,
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
  transactionResolvers,
  healthResolvers,
  githubResolvers,
  macaroonResolvers,
  networkResolvers,
  bosResolvers,
  tbaseResolvers,
  lnUrlResolvers,
  lnMarketsResolvers
);

export const schema = makeExecutableSchema({ typeDefs, resolvers });
