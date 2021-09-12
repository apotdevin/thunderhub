import { requestLimiter } from 'server/helpers/rateLimiter';
import { ContextType } from 'server/types/apiTypes';
import { appUrls } from 'server/utils/appUrls';
import { graphqlFetchWithProxy } from 'server/utils/fetch';
import { signMessage } from 'ln-service';
import { toWithError } from 'server/helpers/async';
import cookieLib from 'cookie';
import { appConstants } from 'server/utils/appConstants';
import { logger } from 'server/helpers/logger';

const ONE_MONTH_SECONDS = 60 * 60 * 24 * 30;

const getUserQuery = `
    query GetUser {
        getUser {
            subscription {
                end_date
                subscribed
                upgradable
            }
        }
    }
`;

const getLoginTokenQuery = `
    query GetLoginToken(
      $seconds: Float
    ) {
        getLoginToken(seconds: $seconds)
    }
`;

const getSignInfoQuery = `
    query GetSignInfo {
        getSignInfo {
            expiry
            identifier
            message
        }
    }
`;

const loginMutation = `
    mutation Login(
        $identifier: String!
        $signature: String!
        $seconds: Float
        $details: String
        $token: Boolean
    ) {
        login(
        identifier: $identifier
        signature: $signature
        seconds: $seconds
        details: $details
        token: $token
        )
  }
`;

export const ambossResolvers = {
  Query: {
    getAmbossUser: async (
      _: undefined,
      __: undefined,
      { ip, ambossAuth }: ContextType
    ) => {
      await requestLimiter(ip, 'getAmbossUser');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.amboss,
        getUserQuery,
        undefined,
        {
          authorization: ambossAuth ? `Bearer ${ambossAuth}` : '',
        }
      );

      if (!data?.getUser || error) {
        return null;
      }

      return data.getUser;
    },
    getAmbossLoginToken: async (
      _: undefined,
      __: undefined,
      { ip, ambossAuth }: ContextType
    ) => {
      await requestLimiter(ip, 'getAmbossLoginToken');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.amboss,
        getLoginTokenQuery,
        { seconds: ONE_MONTH_SECONDS },
        {
          authorization: ambossAuth ? `Bearer ${ambossAuth}` : '',
        }
      );

      if (!data?.getLoginToken || error) {
        throw new Error('Error getting login token from Amboss');
      }

      return data.getLoginToken;
    },
  },
  Mutation: {
    loginAmboss: async (
      _: undefined,
      __: undefined,
      { ip, lnd, res }: ContextType
    ) => {
      await requestLimiter(ip, 'loginAmboss');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.amboss,
        getSignInfoQuery
      );

      if (!data?.getSignInfo || error) {
        throw new Error('Error getting login information from Amboss');
      }

      const [message, signError] = await toWithError<{ signature: string }>(
        signMessage({
          lnd,
          message: data.getSignInfo.message,
        })
      );

      if (!message?.signature || signError) {
        throw new Error('Error signing message to login');
      }

      logger.debug('Signed Amboss login message');

      const { identifier } = data.getSignInfo;
      const params = {
        details: 'ThunderHub',
        identifier,
        signature: message.signature,
        token: true,
        seconds: ONE_MONTH_SECONDS,
      };

      const { data: loginData, error: loginError } =
        await graphqlFetchWithProxy(appUrls.amboss, loginMutation, params);

      if (!loginData.login || loginError) {
        throw new Error('Error logging into Amboss');
      }

      logger.debug('Got Amboss login token');

      res.setHeader(
        'Set-Cookie',
        cookieLib.serialize(appConstants.ambossCookieName, loginData.login, {
          maxAge: ONE_MONTH_SECONDS,
          httpOnly: true,
          sameSite: true,
          path: '/',
        })
      );

      return true;
    },
  },
};
