import { requestLimiter } from 'server/helpers/rateLimiter';
import { ContextType } from 'server/types/apiTypes';
import { appUrls } from 'server/utils/appUrls';
import { graphqlFetchWithProxy } from 'server/utils/fetch';
import { signMessage } from 'ln-service';
import { toWithError } from 'server/helpers/async';
import cookieLib from 'cookie';
import { appConstants } from 'server/utils/appConstants';
import { logger } from 'server/helpers/logger';
import { gql } from 'graphql-tag';
import { print } from 'graphql';

const ONE_MONTH_SECONDS = 60 * 60 * 24 * 30;

const getUserQuery = gql`
  query GetUser {
    getUser {
      subscription {
        end_date
        subscribed
        upgradable
      }
    }
  }
`;

const getLoginTokenQuery = gql`
  query GetLoginToken($seconds: Float) {
    getLoginToken(seconds: $seconds)
  }
`;

const getSignInfoQuery = gql`
  query GetSignInfo {
    getSignInfo {
      expiry
      identifier
      message
    }
  }
`;

const loginMutation = gql`
  mutation Login(
    $identifier: String!
    $signature: String!
    $seconds: Float
    $details: String
    $token: Boolean
  ) {
    login(
      identifier: $identifier
      signature: $signature
      seconds: $seconds
      details: $details
      token: $token
    )
  }
`;

const getNodeBosHistoryQuery = gql`
  query GetNodeBosHistory($pubkey: String!) {
    getNodeBosHistory(pubkey: $pubkey) {
      info {
        count
        first {
          position
          score
          updated
        }
        last {
          position
          score
          updated
        }
      }
      scores {
        position
        score
        updated
      }
    }
  }
`;

const getLastNodeScoreQuery = gql`
  query GetNodeBosHistory($pubkey: String!) {
    getNodeBosHistory(pubkey: $pubkey) {
      info {
        last {
          alias
          public_key
          position
          score
          updated
        }
      }
    }
  }
`;

const getBosScoresQuery = gql`
  query GetBosScores {
    getBosScores {
      position
      score
      updated
      alias
      public_key
    }
  }
`;

const getLightningAddresses = gql`
  query GetLightningAddresses {
    getLightningAddresses {
      pubkey
      lightning_address
    }
  }
`;

export const ambossResolvers = {
  Query: {
    getAmbossUser: async (
      _: undefined,
      __: undefined,
      { ip, ambossAuth }: ContextType
    ) => {
      await requestLimiter(ip, 'getAmbossUser');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.amboss,
        print(getUserQuery),
        undefined,
        {
          authorization: ambossAuth ? `Bearer ${ambossAuth}` : '',
        }
      );

      if (!data?.getUser || error) {
        return null;
      }

      return data.getUser;
    },
    getAmbossLoginToken: async (
      _: undefined,
      __: undefined,
      { ip, ambossAuth }: ContextType
    ) => {
      await requestLimiter(ip, 'getAmbossLoginToken');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.amboss,
        print(getLoginTokenQuery),
        { seconds: ONE_MONTH_SECONDS },
        {
          authorization: ambossAuth ? `Bearer ${ambossAuth}` : '',
        }
      );

      if (!data?.getLoginToken || error) {
        throw new Error('Error getting login token from Amboss');
      }

      return data.getLoginToken;
    },
    getNodeBosHistory: async (
      _: undefined,
      { pubkey }: { pubkey: string },
      { ip, ambossAuth }: ContextType
    ) => {
      await requestLimiter(ip, 'getNodeBosHistory');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.amboss,
        print(getNodeBosHistoryQuery),
        { pubkey },
        {
          authorization: ambossAuth ? `Bearer ${ambossAuth}` : '',
        }
      );

      if (!data?.getNodeBosHistory || error) {
        if (error) {
          logger.error(error);
        }
        throw new Error('Error getting BOS scores for this node');
      }

      return data.getNodeBosHistory;
    },
    getBosScores: async (_: undefined, __: undefined, { ip }: ContextType) => {
      await requestLimiter(ip, 'getBosScores');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.amboss,
        print(getBosScoresQuery)
      );

      if (!data?.getBosScores || error) {
        if (error) {
          logger.error(error);
        }
        throw new Error('Error getting BOS scores');
      }

      return data.getBosScores;
    },
    getLightningAddresses: async (
      _: undefined,
      __: undefined,
      { ip }: ContextType
    ) => {
      await requestLimiter(ip, 'getLightningAddresses');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.amboss,
        print(getLightningAddresses)
      );

      if (!data?.getLightningAddresses || error) {
        if (error) {
          logger.error(error);
        }
        throw new Error('Error getting Lightning Addresses from Amboss');
      }

      return data.getLightningAddresses;
    },
  },
  Mutation: {
    loginAmboss: async (
      _: undefined,
      __: undefined,
      { ip, lnd, res }: ContextType
    ) => {
      await requestLimiter(ip, 'loginAmboss');

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.amboss,
        print(getSignInfoQuery)
      );

      if (!data?.getSignInfo || error) {
        if (error) {
          logger.error(error);
        }
        throw new Error('Error getting login information from Amboss');
      }

      const [message, signError] = await toWithError<{ signature: string }>(
        signMessage({
          lnd,
          message: data.getSignInfo.message,
        })
      );

      if (!message?.signature || signError) {
        if (signError) {
          logger.error(signError);
        }
        throw new Error('Error signing message to login');
      }

      logger.debug('Signed Amboss login message');

      const { identifier } = data.getSignInfo;
      const params = {
        details: 'ThunderHub',
        identifier,
        signature: message.signature,
        token: true,
        seconds: ONE_MONTH_SECONDS,
      };

      const { data: loginData, error: loginError } =
        await graphqlFetchWithProxy(
          appUrls.amboss,
          print(loginMutation),
          params
        );

      if (!loginData.login || loginError) {
        if (loginError) {
          logger.silly(`Error logging into Amboss: ${loginError}`);
        }
        throw new Error('Error logging into Amboss');
      }

      logger.debug('Got Amboss login token');

      res.setHeader(
        'Set-Cookie',
        cookieLib.serialize(appConstants.ambossCookieName, loginData.login, {
          maxAge: ONE_MONTH_SECONDS,
          httpOnly: true,
          sameSite: true,
          path: '/',
        })
      );

      return true;
    },
  },
  channelType: {
    bosScore: async (
      {
        partner_public_key,
      }: {
        partner_public_key: string;
      },
      _: undefined,
      { ambossAuth }: ContextType
    ) => {
      if (!ambossAuth) {
        return null;
      }

      const { data, error } = await graphqlFetchWithProxy(
        appUrls.amboss,
        print(getLastNodeScoreQuery),
        {
          pubkey: partner_public_key,
        },
        {
          authorization: ambossAuth ? `Bearer ${ambossAuth}` : '',
        }
      );

      if (error) {
        logger.silly(`Error getting bos score for node: ${error}`);
        return null;
      }

      return data?.getNodeBosHistory?.info?.last || null;
    },
  },
};
