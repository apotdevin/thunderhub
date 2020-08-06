import crypto from 'crypto';
import { ApolloServer } from 'apollo-server-micro';
import getConfig from 'next/config';
import { readCookie } from 'server/helpers/fileHelpers';
import { schema } from 'server/schema';
import { getContext } from 'server/schema/context';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
const { apiBaseUrl, nodeEnv } = publicRuntimeConfig;
const { cookiePath } = serverRuntimeConfig;

export const secret =
  nodeEnv === 'development'
    ? '123456789'
    : crypto.randomBytes(64).toString('hex');

readCookie(cookiePath);

const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => getContext(req, res),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: apiBaseUrl });
