import { GraphQLList } from 'graphql';
import { ContextType } from 'api/types/apiTypes';
import { ServerAccountType } from 'api/schemas/types/QueryType';
import { requestLimiter } from '../../../helpers/rateLimiter';

export const getServerAccounts = {
  type: new GraphQLList(ServerAccountType),
  resolve: async (_: undefined, params: any, context: ContextType) => {
    const { ip, accounts } = context;
    await requestLimiter(ip, 'getServerAccounts');

    return accounts;
  },
};
