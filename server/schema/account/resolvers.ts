import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';

export const accountResolvers = {
  Query: {
    getAccount: async (_: undefined, __: undefined, context: ContextType) => {
      const { ip, accounts, id } = context;
      await requestLimiter(ip, 'getAccount');

      if (!id) {
        logger.error(`Not authenticated`);
        throw new Error('NotAuthenticated');
      }

      if (id === 'sso') {
        return {
          name: 'SSO Account',
          id: 'sso',
          loggedIn: true,
          type: 'sso',
        };
      }

      const currentAccount = accounts.find(a => a.id === id);

      if (!currentAccount) {
        logger.error(`No account found for id ${id}`);
        throw new Error('NoAccountFound');
      }

      return { ...currentAccount, type: 'server', loggedIn: true };
    },
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
