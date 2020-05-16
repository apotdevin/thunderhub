import { GraphQLList } from 'graphql';
import { ContextType } from 'api/types/apiTypes';
import { ServerAccountType } from 'api/schemas/types/QueryType';
import { SSO_ACCOUNT } from 'src/context/AccountContext';
import { requestLimiter } from '../../../helpers/rateLimiter';

export const getServerAccounts = {
  type: new GraphQLList(ServerAccountType),
  resolve: async (_: undefined, params: any, context: ContextType) => {
    const { ip, accounts, account, sso, ssoVerified } = context;
    await requestLimiter(ip, 'getServerAccounts');

    const { macaroon, cert, host } = sso;
    let ssoAccount = null;
    if (macaroon && cert && host && ssoVerified) {
      ssoAccount = {
        name: 'SSO Account',
        id: SSO_ACCOUNT,
        loggedIn: true,
      };
    }

    const currentId = account?.id;
    const withStatus = accounts.map(a => ({
      ...a,
      loggedIn: a.id === currentId,
    }));

    return ssoAccount ? [...withStatus, ssoAccount] : withStatus;
  },
};
