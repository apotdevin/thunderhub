import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { appUrls } from 'server/utils/appUrls';
import { logger } from 'server/helpers/logger';
import { appConstants } from 'server/utils/appConstants';
import cookieLib from 'cookie';
import { graphqlFetchWithProxy } from 'server/utils/fetch';

const getBaseCanConnectQuery = `
  {
    hello
  }
`;

const getBaseNodesQuery = `
  {
    getNodes {
      _id
      name
      public_key
      socket
    }
  }
`;

const getBasePointsQuery = `
  {
    getPoints {
      alias
      amount
    }
  }
`;

const createBaseInvoiceQuery = `
  mutation CreateInvoice($amount: Int!) {
    createInvoice(amount: $amount) {
      request
      id
    }
  }
`;

const createBaseTokenInvoiceQuery = `
  mutation CreateTokenInvoice($days: Int) {
    createTokenInvoice(days: $days) {
      request
      id
    }
  }
`;

const createThunderPointsQuery = `
  mutation CreatePoints(
    $id: String!
    $alias: String!
    $uris: [String!]!
    $public_key: String!
  ) {
    createPoints(id: $id, alias: $alias, uris: $uris, public_key: $public_key)
  }
`;

const createBaseTokenQuery = `
  mutation CreateBaseToken($id: String!) {
    createBaseToken(id: $id)
  }
`;

export const tbaseResolvers = {
  Query: {
    getBaseCanConnect: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ): Promise<boolean> => {
      await requestLimiter(context.ip, 'getBaseCanConnect');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.tbase,
        getBaseCanConnectQuery
      );

      if (error || !data?.hello) return false;

      return true;
    },
    getBaseNodes: async (_: undefined, __: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getBaseNodes');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.tbase,
        getBaseNodesQuery
      );

      if (error || !data?.getNodes) return [];

      return data.getNodes.filter(
        (n: { public_key: string; socket: string }) => n.public_key && n.socket
      );
    },
    getBasePoints: async (_: undefined, __: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getBasePoints');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.tbase,
        getBasePointsQuery
      );

      if (error || !data?.getPoints) return [];

      return data.getPoints;
    },
  },
  Mutation: {
    createBaseInvoice: async (
      _: undefined,
      params: { amount: number },
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'createBaseInvoice');

      if (!params?.amount) return '';

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.tbase,
        createBaseInvoiceQuery,
        params
      );

      if (error) return null;
      if (data?.createInvoice) return data.createInvoice;

      return null;
    },
    createBaseToken: async (
      _: undefined,
      { id }: { id: string },
      { ip, res }: ContextType
    ) => {
      await requestLimiter(ip, 'createBaseInvoice');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.tbase,
        createBaseTokenQuery,
        { id }
      );

      if (error || !data?.createBaseToken) {
        logger.debug('Error getting thunderbase token');
        throw new Error('ErrorGettingToken');
      }

      res.setHeader(
        'Set-Cookie',
        cookieLib.serialize(
          appConstants.tokenCookieName,
          data.createBaseToken,
          {
            maxAge: 60 * 60 * 24 * 30, //One month
            httpOnly: true,
            sameSite: true,
            path: '/',
          }
        )
      );

      return true;
    },
    deleteBaseToken: async (
      _: undefined,
      __: undefined,
      { ip, res }: ContextType
    ) => {
      await requestLimiter(ip, 'deleteBaseToken');

      res.setHeader(
        'Set-Cookie',
        cookieLib.serialize(appConstants.tokenCookieName, '', {
          maxAge: -1,
          httpOnly: true,
          sameSite: true,
          path: '/',
        })
      );
      return true;
    },
    createBaseTokenInvoice: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'createBaseTokenInvoice');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.tbase,
        createBaseTokenInvoiceQuery
      );

      if (error || !data?.createTokenInvoice) {
        logger.error('Error getting invoice for token');
        throw new Error('ErrorGettingInvoice');
      }
      return data.createTokenInvoice;
    },
    createThunderPoints: async (
      _: undefined,
      params: { id: string; alias: string; uris: string[]; public_key: string },
      context: ContextType
    ): Promise<boolean> => {
      await requestLimiter(context.ip, 'createThunderPoints');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.tbase,
        createThunderPointsQuery,
        params
      );

      if (error || !data?.createPoints) return false;

      return true;
    },
  },
};
