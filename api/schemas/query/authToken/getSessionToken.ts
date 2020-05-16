import { GraphQLString } from 'graphql';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { ContextType } from 'api/types/apiTypes';
import AES from 'crypto-js/aes';
import { requestLimiter } from '../../../helpers/rateLimiter';

export const getSessionToken = {
  type: GraphQLString,
  args: {
    id: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    const { ip, secret } = context;
    await requestLimiter(ip, 'getSessionToken');

    const account = context.accounts.find(a => a.id === params.id) || null;

    console.log({ account });
    if (!account) return null;

    try {
      const bytes = AES.decrypt(account.macaroon, params.password);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return jwt.sign({ password: decrypted }, secret);
    } catch (error) {
      throw new Error('Wrong password');
    }
  },
};
