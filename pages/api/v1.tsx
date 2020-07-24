import crypto from 'crypto';
import { ApolloServer } from 'apollo-server-micro';
import { getIp } from 'server/helpers/helpers';
import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import { logger } from 'server/helpers/logger';
import {
  readMacaroons,
  readFile,
  readCookie,
  getAccounts,
} from 'server/helpers/fileHelpers';
import { ContextType, SSOType } from 'server/types/apiTypes';
import cookie from 'cookie';
import schema from 'server/schema';
import { LndObject } from 'server/types/ln-service.types';
import { getAuthLnd } from 'server/helpers/auth';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
const { apiBaseUrl, nodeEnv } = publicRuntimeConfig;
const {
  cookiePath,
  macaroonPath,
  lnCertPath,
  lnServerUrl,
  accountConfigPath,
} = serverRuntimeConfig;

const secret =
  nodeEnv === 'development'
    ? '123456789'
    : crypto.randomBytes(64).toString('hex');

const ssoMacaroon = readMacaroons(macaroonPath);
const ssoCert = readFile(lnCertPath);
const accountConfig = getAccounts(accountConfigPath);

let sso: SSOType | null = null;

if (ssoMacaroon && lnServerUrl) {
  sso = {
    macaroon: ssoMacaroon,
    socket: lnServerUrl,
    cert: ssoCert,
  };
}

readCookie(cookiePath);

const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => {
    const ip = getIp(req);

    const { Auth } = cookie.parse(req.headers.cookie ?? '');

    let lnd: LndObject | null = null;
    let id: string | null = null;

    if (Auth) {
      try {
        const data = jwt.verify(Auth, secret) as { id: string };
        if (data && data.id) {
          lnd = getAuthLnd(data.id, sso, accountConfig);
          id = data.id;
        }
      } catch (error) {
        logger.silly('Authentication cookie failed');
      }
    }

    const context: ContextType = {
      ip,
      lnd,
      secret,
      id,
      sso,
      accounts: accountConfig,
      res,
    };

    return context;
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: apiBaseUrl });
