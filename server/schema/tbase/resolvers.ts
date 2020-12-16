import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { toWithError } from 'server/helpers/async';
import { appUrls } from 'server/utils/appUrls';
import { request, gql } from 'graphql-request';
import { logger } from 'server/helpers/logger';
import { GraphQLError } from 'graphql';
import { appConstants } from 'server/utils/appConstants';
import cookieLib from 'cookie';

const getBaseCanConnectQuery = gql`
  {
    hello
  }
`;

const getBaseInfoQuery = gql`
  {
    getInfo {
      lastBosUpdate
      apiTokenSatPrice
      apiTokenOriginalSatPrice
    }
  }
`;

const getBaseNodesQuery = gql`
  {
    getNodes {
      _id
      name
      public_key
      socket
    }
  }
`;

const getBasePointsQuery = gql`
  {
    getPoints {
      alias
      amount
    }
  }
`;

const createBaseInvoiceQuery = gql`
  mutation CreateInvoice($amount: Int!) {
    createInvoice(amount: $amount) {
      request
      id
    }
  }
`;

const createBaseTokenInvoiceQuery = gql`
  mutation CreateTokenInvoice($days: Int) {
    createTokenInvoice(days: $days) {
      request
      id
    }
  }
`;

const createThunderPointsQuery = gql`
  mutation CreatePoints(
    $id: String!
    $alias: String!
    $uris: [String!]!
    $public_key: String!
  ) {
    createPoints(id: $id, alias: $alias, uris: $uris, public_key: $public_key)
  }
`;

const createBaseTokenQuery = gql`
  mutation CreateBaseToken($id: String!) {
    createBaseToken(id: $id)
  }
`;

const getBosScoresQuery = gql`
  {
    getBosScores {
      updated
      scores {
        alias
        public_key
        score
        updated
        position
      }
    }
  }
`;

const getBosNodeScoresQuery = gql`
  query GetNodeScores($publicKey: String!, $token: String!) {
    getNodeScores(publicKey: $publicKey, token: $token) {
      alias
      public_key
      score
      updated
      position
    }
  }
`;

export const tbaseResolvers = {
  Query: {
    getBaseInfo: async (_: undefined, __: undefined, context: ContextType) => {
      await requestLimiter(context.ip, 'getBaseInfo');

      const [data, error] = await toWithError(
        request(appUrls.tbase, getBaseInfoQuery)
      );

      if (error || !data?.getInfo) {
        logger.error('Error getting info: %o', { error });
        throw new GraphQLError('ErrorGettingInfo');
      }

      return data.getInfo;
    },
    getBaseCanConnect: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ): Promise<boolean> => {
      await requestLimiter(context.ip, 'getBaseCanConnect');

      const [data, error] = await toWithError(
        request(appUrls.tbase, getBaseCanConnectQuery)
      );

      if (error || !data?.hello) return false;

      return true;
    },
    getBosNodeScores: async (
      _: undefined,
      { publicKey }: { publicKey: string },
      { ip, tokenAuth }: ContextType
    ) => {
      if (!tokenAuth) {
        logger.error('No ThunderBase auth token available');
        throw new GraphQLError('NotAuthenticated');
      }

      await requestLimiter(ip, 'getBosNodeScores');

      const [data, error] = await toWithError(
        request(appUrls.tbase, getBosNodeScoresQuery, {
          publicKey,
          token: tokenAuth,
        })
      );

      if (error) {
        logger.error('Error getting BOS scores: %o', { error });
        throw new GraphQLError('ErrorGettingBosScores');
      }

      return data?.getNodeScores || [];
    },
    getBosScores: async (_: undefined, __: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getBosScores');

      const [data, error] = await toWithError(
        request(appUrls.tbase, getBosScoresQuery)
      );

      if (error || !data?.getBosScores) {
        logger.error('Error getting BOS scores: %o', { error });
        throw new GraphQLError('ErrorGettingBosScores');
      }

      return data.getBosScores;
    },
    getBaseNodes: async (_: undefined, __: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getBaseNodes');

      const [data, error] = await toWithError(
        request(appUrls.tbase, getBaseNodesQuery)
      );

      if (error || !data?.getNodes) return [];

      return data.getNodes.filter(
        (n: { public_key: string; socket: string }) => n.public_key && n.socket
      );
    },
    getBasePoints: async (_: undefined, __: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getBasePoints');

      const [data, error] = await toWithError(
        request(appUrls.tbase, getBasePointsQuery)
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

      const [data, error] = await toWithError(
        request(appUrls.tbase, createBaseInvoiceQuery, params)
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

      const [data, error] = await toWithError(
        request(appUrls.tbase, createBaseTokenQuery, { id })
      );

      if (error || !data?.createBaseToken) {
        logger.debug('Error getting thunderbase token: %o', { error });
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

      const [data, error] = await toWithError(
        request(appUrls.tbase, createBaseTokenInvoiceQuery)
      );

      if (error || !data?.createTokenInvoice) {
        logger.error('Error getting invoice for token: %o', error);
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

      const [info, error] = await toWithError(
        request(appUrls.tbase, createThunderPointsQuery, params)
      );

      if (error || !info?.createPoints) return false;

      return true;
    },
  },
};
