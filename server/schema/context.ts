import { getIp } from 'server/helpers/helpers';
import jwt from 'jsonwebtoken';
import { logger } from 'server/helpers/logger';
import {
  readMacaroons,
  readFile,
  getAccounts,
} from 'server/helpers/fileHelpers';
import getConfig from 'next/config';
import { ContextType, SSOType } from 'server/types/apiTypes';
import cookie from 'cookie';
import { LndObject } from 'server/types/ln-service.types';
import { getAuthLnd } from 'server/helpers/auth';
import { appConstants } from 'server/utils/appConstants';
import { secret } from 'pages/api/v1';
import { ResolverContext } from 'config/client';

const { serverRuntimeConfig } = getConfig();
const {
  macaroonPath,
  lnCertPath,
  lnServerUrl,
  accountConfigPath,
} = serverRuntimeConfig;

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

export const getContext = (context: ResolverContext) => {
  const { req, res } = context;

  if (!req || !res) return {};

  const ip = getIp(req);

  const cookies = cookie.parse(req.headers.cookie ?? '') || {};
  const auth = cookies[appConstants.cookieName];
  const lnMarketsAuth = cookies[appConstants.lnMarketsAuth];

  let lnd: LndObject | null = null;
  let id: string | null = null;

  if (auth) {
    try {
      const data = jwt.verify(auth, secret) as { id: string };
      if (data && data.id) {
        lnd = getAuthLnd(data.id, sso, accountConfig);
        id = data.id;
      }
    } catch (error) {
      logger.silly('Authentication cookie failed');
    }
  }

  const resolverContext: ContextType = {
    ip,
    lnd,
    secret,
    id,
    sso,
    accounts: accountConfig,
    res,
    lnMarketsAuth,
  };

  return resolverContext;
};
