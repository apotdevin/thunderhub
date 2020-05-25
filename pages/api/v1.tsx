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
  context: ({ req }) => {
    const ip = getIp(req);

    let ssoVerified = false;
    if (req?.cookies?.SSOAuth) {
      logger.silly('SSOAuth cookie found in request');
      try {
        jwt.verify(req.cookies.SSOAuth, secret);
        ssoVerified = true;
      } catch (error) {
        logger.silly('SSO authentication cookie failed');
      }
    }

    let account = null;
    if (req?.cookies?.AccountAuth) {
      logger.silly('AccountAuth cookie found in request');
      try {
        const bytes = AES.decrypt(req.cookies.AccountAuth, secret);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const cookieAccount = jwt.verify(decrypted, secret);
        const accountId = cookieAccount['id'] || '';
        const accountMacaroon = cookieAccount['macaroon'] || '';
        const accountCert = cookieAccount['cert'] || '';
        const accountHost = cookieAccount['host'] || '';

        account = {
          id: accountId,
          host: accountHost,
          cert: accountCert,
          macaroon: accountMacaroon,
        };
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
