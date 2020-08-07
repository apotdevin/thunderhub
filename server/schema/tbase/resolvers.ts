import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { toWithError } from 'server/helpers/async';
import { appUrls } from 'server/utils/appUrls';
import { request, gql } from 'graphql-request';

const getBaseCanConnectQuery = gql`
  {
    hello
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

const createBaseInvoiceQuery = gql`
  mutation CreateInvoice($amount: Int!) {
    createInvoice(amount: $amount) {
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

export const tbaseResolvers = {
  Query: {
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
    getBaseNodes: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getBaseNodes');

      const [data, error] = await toWithError(
        request(appUrls.tbase, getBaseNodesQuery)
      );

      if (error || !data?.getNodes) return [];

      return data.getNodes.filter(
        (n: { public_key: string; socket: string }) => n.public_key && n.socket
      );
    },
  },
  Mutation: {
    createBaseInvoice: async (
      _: undefined,
      params: { amount: number },
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'getBaseInvoice');

      if (!params?.amount) return '';

      const [data, error] = await toWithError(
        request(appUrls.tbase, createBaseInvoiceQuery, params)
      );

      if (error) return null;
      if (data?.createInvoice) return data.createInvoice;

      return null;
    },
    createThunderPoints: async (
      _: undefined,
      params: { id: string; alias: string; uris: string[]; public_key: string },
      context: ContextType
    ): Promise<boolean> => {
      await requestLimiter(context.ip, 'getThunderPoints');

      const [info, error] = await toWithError(
        request(appUrls.tbase, createThunderPointsQuery, params)
      );

      if (error || !info?.createPoints) return false;

      return true;
    },
  },
};
