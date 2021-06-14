import crypto from 'crypto';
import { ApolloServer } from 'apollo-server-micro';
import getConfig from 'next/config';
import { schema } from 'server/schema';
import { getContext } from 'server/schema/context';

const { publicRuntimeConfig } = getConfig();
const { apiBaseUrl, nodeEnv } = publicRuntimeConfig;

export const secret =
  nodeEnv === 'development'
    ? '123456789'
    : crypto.randomBytes(64).toString('hex');

const apolloServer = new ApolloServer({
  schema,
  context: ctx => getContext(ctx),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: apiBaseUrl });
