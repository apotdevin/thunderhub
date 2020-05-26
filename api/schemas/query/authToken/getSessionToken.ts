import { GraphQLString, GraphQLBoolean } from 'graphql';
import jwt from 'jsonwebtoken';
import { ContextType } from 'api/types/apiTypes';
import AES from 'crypto-js/aes';
import { logger } from 'api/helpers/logger';
import cookie from 'cookie';
import { requestLimiter } from '../../../helpers/rateLimiter';

export const getSessionToken = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    const { ip, secret, res } = context;
    await requestLimiter(ip, 'getSessionToken');

    const account = context.accounts.find(a => a.id === params.id) || null;

    if (!account) {
      logger.debug(`Account ${params.id} not found`);
      return null;
    }

    try {
      AES.decrypt(account.macaroon, params.password);
      logger.debug(`Correct password for account ${params.id}`);
      const token = jwt.sign(
        {
          id: params.id,
          password: AES.encrypt(params.password, secret).toString(),
        },
        secret
      );
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('AccountAuth', token, {
          httpOnly: true,
          sameSite: true,
        })
      );
      return true;
    } catch (error) {
      throw new Error('WrongPasswordForLogin');
    }
  },
};
