import { ContextType } from 'server/types/apiTypes';
import { SSO_ACCOUNT, SERVER_ACCOUNT } from 'src/context/AccountContext';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';

export const accountResolvers = {
  Query: {
    getServerAccounts: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      const { ip, accounts, account, sso, ssoVerified } = context;
      await requestLimiter(ip, 'getServerAccounts');

      let ssoAccount = null;
      if (ssoVerified && sso) {
        const { cert, host } = sso;
        logger.debug(
          `Macaroon${
            cert ? ', certificate' : ''
          } and host (${host}) found for SSO.`
        );
        ssoAccount = {
          name: 'SSO Account',
          id: SSO_ACCOUNT,
          loggedIn: true,
          type: SSO_ACCOUNT,
        };
      }

      const withStatus =
        accounts?.map(a => ({
          ...a,
          loggedIn: a.id === account,
          type: SERVER_ACCOUNT,
        })) || [];

      return ssoAccount ? [...withStatus, ssoAccount] : withStatus;
    },
  },
};
