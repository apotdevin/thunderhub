import { GraphQLString } from 'graphql';
import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import { readCookie, refreshCookie } from 'api/helpers/fileHelpers';
import { ContextType } from 'api/types/apiTypes';
import { SSO_ACCOUNT } from 'src/context/NewAccountContext';
import { requestLimiter } from '../../../helpers/rateLimiter';

const { serverRuntimeConfig } = getConfig();
const { cookiePath } = serverRuntimeConfig;

export const getAuthToken = {
  type: GraphQLString,
  args: {
    cookie: { type: GraphQLString },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    const { ip, secret } = context;
    await requestLimiter(ip, 'setup');

    if (!params.cookie) {
      return null;
    }

    if (cookiePath === '') {
      return null;
    }

    const cookieFile = readCookie(cookiePath);

    // console.log({ param: params.cookie, cookiePath, cookieFile });

    // refreshCookie(cookiePath);

    // console.log('Cookie in file: ', {
    //   cookieFile,
    //   param: params.cookie,
    //   secret,
    // });

    if (cookieFile === params.cookie) {
      const token = jwt.sign({ user: SSO_ACCOUNT }, secret);

      // console.log('Created token: ', { token });
      return token;
    }

    return null;
  },
};
