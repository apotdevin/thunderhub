import crypto from 'crypto';
import { ApolloServer } from 'apollo-server-micro';
import { thunderHubSchema } from 'api/schemas';
import { getIp } from 'api/helpers/helpers';
import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import { logger } from 'api/helpers/logger';
import {
  readMacaroons,
  readFile,
  readCookie,
  getAccounts,
} from 'api/helpers/fileHelpers';
import { ContextType } from 'api/types/apiTypes';
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import cookie from 'cookie';

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

readCookie(cookiePath);

const apolloServer = new ApolloServer({
  schema: thunderHubSchema,
  context: ({ req, res }) => {
    const ip = getIp(req);

    const { AccountAuth, SSOAuth } = cookie.parse(req.headers.cookie ?? '');

    let ssoVerified = false;
    if (SSOAuth) {
      logger.silly('SSOAuth cookie found in request');
      try {
        jwt.verify(SSOAuth, secret);
        ssoVerified = true;
      } catch (error) {
        logger.silly('SSO authentication cookie failed');
      }
    }

    let account = null;
    if (AccountAuth) {
      logger.silly('AccountAuth cookie found in request');
      try {
        const cookieAccount = jwt.verify(AccountAuth, secret);
        const id = cookieAccount['id'] || '';
        const bytes = AES.decrypt(cookieAccount['password'], secret);
        const password = bytes.toString(CryptoJS.enc.Utf8);

        account = { id, password };
      } catch (error) {
        logger.silly('Account authentication cookie failed');
      }
    }

    const context: ContextType = {
      ip,
      secret,
      ssoVerified,
      account,
      sso: { macaroon: ssoMacaroon, cert: ssoCert, host: lnServerUrl || null },
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
