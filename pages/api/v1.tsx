import crypto from 'crypto';
import { ApolloServer } from 'apollo-server-micro';
import { thunderHubSchema } from 'api/schemas';
import { getIp } from 'api/helpers/helpers';
import getConfig from 'next/config';
import Cors from 'micro-cors';
import jwt from 'jsonwebtoken';
import { logger } from 'api/helpers/logger';
import {
  readMacaroons,
  readFile,
  readCookie,
  getAccounts,
} from 'api/helpers/fileHelpers';
import { ContextType } from 'api/types/apiTypes';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
const { apiBaseUrl } = publicRuntimeConfig;
const {
  cookiePath,
  macaroonPath,
  lnCertPath,
  lnServerUrl,
  accountConfigPath,
} = serverRuntimeConfig;

const secret = crypto.randomBytes(64).toString('hex');
// const secret = '123456789';

const ssoMacaroon = readMacaroons(macaroonPath);
const ssoCert = readFile(lnCertPath);
const accountConfig = getAccounts(accountConfigPath);

// console.log({ secret, ssoMacaroon, ssoCert, accountConfig });

readCookie(cookiePath);

const cors = Cors({
  origin: true,
  allowCredentials: true,
});

const apolloServer = new ApolloServer({
  schema: thunderHubSchema,
  context: async ({ req }) => {
    const ip = getIp(req);

    let ssoVerified = false;
    if (req?.cookies?.SSOAuth) {
      try {
        jwt.verify(req.cookies.SSOAuth, secret);
        ssoVerified = true;
      } catch (error) {
        logger.warn('Error verifying SSO authentication cookie');
      }
    }

    let accountPassword = '';
    if (req?.cookies?.AccountAuth) {
      try {
        const account = jwt.verify(req.cookies.AccountAuth, secret);
        accountPassword = account['password'] || '';
      } catch (error) {
        logger.warn('Error verifying account authentication cookie');
      }
    }

    const context: ContextType = {
      ip,
      secret,
      ssoVerified,
      accountPassword,
      sso: { macaroon: ssoMacaroon, cert: ssoCert, host: lnServerUrl },
      accounts: accountConfig,
    };

    return context;
  },
});

const handler = apolloServer.createHandler({ path: apiBaseUrl });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default cors(handler);
