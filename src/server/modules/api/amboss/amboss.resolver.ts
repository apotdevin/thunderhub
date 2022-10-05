import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FetchService } from '../../fetch/fetch.service';
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
import {
  getLightningAddresses,
  getLoginTokenQuery,
  getNodeSocialInfo,
  getSignInfoQuery,
  getUserQuery,
  loginMutation,
} from './amboss.gql';
import { AmbossService } from './amboss.service';

const ONE_MONTH_SECONDS = 60 * 60 * 24 * 30;

@Resolver()
export class AmbossResolver {
  constructor(
    private nodeService: NodeService,
    private configService: ConfigService,
    private fetchService: FetchService,
    private ambossService: AmbossService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => AmbossUser, { nullable: true })
  async getAmbossUser(@Context() { ambossAuth }: ContextType) {
    if (!ambossAuth) return null;

    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      this.configService.get('urls.amboss'),
      getUserQuery,
      undefined,
      {
        authorization: `Bearer ${ambossAuth}`,
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

  @Mutation(() => Boolean)
  async pushBackup(@CurrentUser() { id }: UserId) {
    const backups = await this.nodeService.getBackups(id);

    const { signature } = await this.nodeService.signMessage(
      id,
      backups.backup
    );

    await this.ambossService.pushBackup(backups.backup, signature);

    return true;
  }
}
