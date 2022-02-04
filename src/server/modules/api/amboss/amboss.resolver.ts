import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FetchService } from '../../fetch/fetch.service';
import { gql } from 'graphql-tag';
import { ContextType } from 'src/server/app.module';
import { appConstants } from 'src/server/utils/appConstants';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import cookie from 'cookie';
import {
  AmbossUser,
  LightningAddress,
  LightningNodeSocialInfo,
} from './amboss.types';
import { ConfigService } from '@nestjs/config';
import { toWithError } from 'src/server/utils/async';
import { NodeService } from '../../node/node.service';
import { UserId } from '../../security/security.types';
import { CurrentUser } from '../../security/security.decorators';

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

const getLightningAddresses = gql`
  query GetLightningAddresses {
    getLightningAddresses {
      pubkey
      lightning_address
    }
  }
`;

const getNodeSocialInfo = gql`
  query GetNodeSocialInfo($pubkey: String!) {
    getNode(pubkey: $pubkey) {
      socials {
        info {
          private
          telegram
          twitter
          twitter_verified
          website
          email
        }
      }
    }
  }
`;

@Resolver()
export class AmbossResolver {
  constructor(
    private nodeService: NodeService,
    private configService: ConfigService,
    private fetchService: FetchService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => AmbossUser, { nullable: true })
  async getAmbossUser(@Context() { ambossAuth }: ContextType) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      this.configService.get('urls.amboss'),
      getUserQuery,
      undefined,
      {
        authorization: ambossAuth ? `Bearer ${ambossAuth}` : '',
      }
    );

    if (!data?.getUser || error) {
      return null;
    }

    return data.getUser;
  }

  @Query(() => String)
  async getAmbossLoginToken(@Context() { ambossAuth }: ContextType) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      this.configService.get('urls.amboss'),
      getLoginTokenQuery,
      { seconds: ONE_MONTH_SECONDS },
      {
        authorization: ambossAuth ? `Bearer ${ambossAuth}` : '',
      }
    );

    if (!data?.getLoginToken || error) {
      throw new Error('Error getting login token from Amboss');
    }

    return data.getLoginToken;
  }

  @Query(() => [LightningAddress])
  async getLightningAddresses() {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      this.configService.get('urls.amboss'),
      getLightningAddresses
    );

    if (!data?.getLightningAddresses || error) {
      if (error) {
        this.logger.error(error);
      }
      throw new Error('Error getting Lightning Addresses from Amboss');
    }

    return data.getLightningAddresses;
  }

  @Query(() => LightningNodeSocialInfo)
  async getNodeSocialInfo(
    @Args('pubkey') pubkey: string,
    @Context() { ambossAuth }: ContextType
  ) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      this.configService.get('urls.amboss'),
      getNodeSocialInfo,
      { pubkey },
      {
        authorization: ambossAuth ? `Bearer ${ambossAuth}` : '',
      }
    );

    if (!data?.getNode || error) {
      if (error) {
        this.logger.error(error);
      }
      throw new Error('Error getting node information from Amboss');
    }

    return data.getNode;
  }

  @Mutation(() => Boolean)
  async loginAmboss(
    @Context() { res }: ContextType,
    @CurrentUser() user: UserId
  ) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      this.configService.get('urls.amboss'),
      getSignInfoQuery
    );

    if (!data?.getSignInfo || error) {
      if (error) {
        this.logger.error(error);
      }
      throw new Error('Error getting login information from Amboss');
    }

    const [message, signError] = await toWithError<{ signature: string }>(
      this.nodeService.signMessage(user.id, data.getSignInfo.message)
    );

    if (!message?.signature || signError) {
      if (signError) {
        this.logger.error(signError);
      }
      throw new Error('Error signing message to login');
    }

    this.logger.debug('Signed Amboss login message');

    const { identifier } = data.getSignInfo;
    const params = {
      details: 'ThunderHub',
      identifier,
      signature: message.signature,
      token: true,
      seconds: ONE_MONTH_SECONDS,
    };

    const { data: loginData, error: loginError } =
      await this.fetchService.graphqlFetchWithProxy(
        this.configService.get('urls.amboss'),
        loginMutation,
        params
      );

    if (!loginData.login || loginError) {
      if (loginError) {
        this.logger.silly(`Error logging into Amboss: ${loginError}`);
      }
      throw new Error('Error logging into Amboss');
    }

    this.logger.debug('Got Amboss login token');

    res.setHeader(
      'Set-Cookie',
      cookie.serialize(appConstants.ambossCookieName, loginData.login, {
        maxAge: ONE_MONTH_SECONDS,
        httpOnly: true,
        sameSite: true,
        path: '/',
      })
    );

    return true;
  }
}
