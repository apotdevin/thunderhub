import { GraphQLString } from 'graphql';
import { requestLimiter } from '../../../helpers/rateLimiter';
import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import { SSO_USER } from 'src/utils/auth';
import { readCookie, refreshCookie } from 'api/helpers/fileHelpers';

const { serverRuntimeConfig } = getConfig();
const {
  cookiePath,
  lnServerUrl,
  lnCertPath,
  macaroonPath,
} = serverRuntimeConfig;

export const getAuthToken = {
  type: GraphQLString,
  args: {
    cookie: { type: GraphQLString },
  },
  resolve: async (root: any, params: any, context: any) => {
    const { ip, secret } = context;
    await requestLimiter(ip, 'setup');

    if (!params.cookie) {
      return null;
    }

    const cookieFile = readCookie(cookiePath);

    // refreshCookie(cookiePath);

    // console.log('Cookie in file: ', {
    //   cookieFile,
    //   param: params.cookie,
    //   secret,
    // });

    if (cookieFile === params.cookie) {
      const token = jwt.sign(
        { user: SSO_USER, lnServerUrl, lnCertPath, macaroonPath },
        secret
      );

      // console.log('Created token: ', { token });
      return token;
    }

    return null;
  },
};
