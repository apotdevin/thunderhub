import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';

export const accountResolvers = {
  Query: {
    getServerAccounts: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      const { ip, accounts, id, sso } = context;
      await requestLimiter(ip, 'getServerAccounts');

      let ssoAccount = null;
      if (id === 'sso' && sso) {
        const { cert, socket } = sso;
        logger.debug(
          `Macaroon${
            cert ? ', certificate' : ''
          } and host (${socket}) found for SSO.`
        );
        ssoAccount = {
          name: 'SSO Account',
          id: 'sso',
          loggedIn: true,
          type: 'sso',
        };
      }

      const withStatus =
        accounts?.map(a => ({
          ...a,
          loggedIn: a.id === id,
          type: 'server',
        })) || [];

      return ssoAccount ? [ssoAccount, ...withStatus] : withStatus;
    },
  },
};
