import { GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { ContextType } from 'server/types/apiTypes';
import { SSO_ACCOUNT, SERVER_ACCOUNT } from 'src/context/AccountContext';
import cookie from 'cookie';
import { requestLimiter } from '../../../helpers/rateLimiter';

export const logout = {
  type: GraphQLBoolean,
  args: {
    type: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    const { ip, res } = context;
    await requestLimiter(ip, 'logout');

    if (params.type === SSO_ACCOUNT) {
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('SSOAuth', '', { maxAge: 1 })
      );
      return true;
    }
    if (params.type === SERVER_ACCOUNT) {
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('AccountAuth', '', { maxAge: 1 })
      );
      return true;
    }
    return true;
  },
};
