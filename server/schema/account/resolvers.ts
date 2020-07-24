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
      const { ip, accounts, id, sso } = context;
      await requestLimiter(ip, 'getServerAccounts');

      logger.debug('IDDDDDD %o', { id, SSO_ACCOUNT });

      let ssoAccount = null;
      if (id === SSO_ACCOUNT && sso) {
        const { cert, socket } = sso;
        logger.debug(
          `Macaroon${
            cert ? ', certificate' : ''
          } and host (${socket}) found for SSO.`
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
          loggedIn: a.id === id,
          type: SERVER_ACCOUNT,
        })) || [];

      return ssoAccount ? [ssoAccount, ...withStatus] : withStatus;
    },
  },
};
