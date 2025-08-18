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
  LightningNodeSocialInfo,
  LoginAuto,
  OauthAuto,
} from './amboss.types';
import { ConfigService } from '@nestjs/config';
import { toWithError } from 'src/server/utils/async';
import { NodeService } from '../../node/node.service';
import { UserId } from '../../security/security.types';
import { CurrentUser } from '../../security/security.decorators';
import {
  AuthorizeDomain,
  CreateApiKey,
  NodeLogin,
  NodeLoginInfo,
  getNodeSocialInfo,
  getUserQuery,
} from './amboss.gql';
import { AmbossService } from './amboss.service';
import { auto } from 'async';

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

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      this.configService.get('urls.amboss.space'),
      getUserQuery,
      undefined,
      { authorization: `Bearer ${ambossAuth}` }
    );

    if (!data?.getUser || error) {
      return null;
    }

    return data.getUser;
  }

  @Query(() => String)
  async getAmbossLoginToken(@CurrentUser() user: UserId) {
    const info = await auto<OauthAuto>({
      signMessage: async (): Promise<OauthAuto['signMessage']> => {
        const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
          login: { node_login: { identifier: string; message: string } };
        }>(this.configService.get('urls.amboss.auth'), NodeLoginInfo);

        if (!data?.login.node_login || error) {
          if (error) this.logger.error(error);
          throw new Error('Error getting login information from Amboss');
        }

        const { identifier, message } = data.login.node_login;

        const [signedMessage, signError] = await toWithError<{
          signature: string;
        }>(this.nodeService.signMessage(user.id, message));

        if (!signedMessage?.signature || signError) {
          if (signError) this.logger.error(signError);
          throw new Error('Error signing message to login');
        }

        this.logger.debug('Signed Amboss login message');

        return { identifier, signature: signedMessage.signature };
      },

      getAuthJwt: [
        'signMessage',
        async ({ signMessage }): Promise<OauthAuto['getAuthJwt']> => {
          const { data, error } =
            await this.fetchService.graphqlFetchWithProxy<{
              public: { node_login: { jwt: string } };
            }>(this.configService.get('urls.amboss.auth'), NodeLogin, {
              input: {
                identifier: signMessage.identifier,
                signature: signMessage.signature,
              },
            });

          if (!data?.public.node_login.jwt || error) {
            if (error) this.logger.error(error);
            throw new Error('Error getting login information from Amboss');
          }

          return { jwt: data.public.node_login.jwt };
        },
      ],

      getOauth: [
        'getAuthJwt',
        async ({ getAuthJwt }): Promise<OauthAuto['getOauth']> => {
          const { data, error } =
            await this.fetchService.graphqlFetchWithProxy<{
              auth: {
                authorize_domain: { token_url: string; has_access: string };
              };
            }>(
              this.configService.get('urls.amboss.auth'),
              AuthorizeDomain,
              {
                input: {
                  redirect_url: 'https://amboss.space/oauth',
                },
              },
              { authorization: `Bearer ${getAuthJwt.jwt}` }
            );

          if (!data?.auth.authorize_domain.token_url || error) {
            if (error) this.logger.error(error);
            throw new Error('Error getting login information from Amboss');
          }

          console.log(data);

          this.logger.debug('Got Amboss login token');

          return { url: data.auth.authorize_domain.token_url };
        },
      ],
    });

    return info.getOauth.url;
  }

  @Query(() => LightningNodeSocialInfo)
  async getNodeSocialInfo(
    @Args('pubkey') pubkey: string,
    @Context() { ambossAuth }: ContextType
  ) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      this.configService.get('urls.amboss.space'),
      getNodeSocialInfo,
      { pubkey },
      { authorization: ambossAuth ? `Bearer ${ambossAuth}` : '' }
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
    const info = await auto<LoginAuto>({
      nodePubkey: async (): Promise<LoginAuto['nodePubkey']> => {
        const [info, error] = await toWithError(
          this.nodeService.getWalletInfo(user.id)
        );

        if (!info.public_key || error) return { pubkey: undefined };

        return { pubkey: info.public_key };
      },

      signMessage: async (): Promise<LoginAuto['signMessage']> => {
        const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
          login: { node_login: { identifier: string; message: string } };
        }>(this.configService.get('urls.amboss.auth'), NodeLoginInfo);

        if (!data?.login.node_login || error) {
          if (error) this.logger.error(error);
          throw new Error('Error getting login information from Amboss');
        }

        const { identifier, message } = data.login.node_login;

        const [signedMessage, signError] = await toWithError<{
          signature: string;
        }>(this.nodeService.signMessage(user.id, message));

        if (!signedMessage?.signature || signError) {
          if (signError) this.logger.error(signError);
          throw new Error('Error signing message to login');
        }

        this.logger.debug('Signed Amboss login message');

        return { identifier, signature: signedMessage.signature };
      },

      getAuthJwt: [
        'signMessage',
        async ({ signMessage }): Promise<LoginAuto['getAuthJwt']> => {
          const { data, error } =
            await this.fetchService.graphqlFetchWithProxy<{
              public: { node_login: { jwt: string } };
            }>(this.configService.get('urls.amboss.auth'), NodeLogin, {
              input: {
                identifier: signMessage.identifier,
                signature: signMessage.signature,
              },
            });

          if (!data?.public.node_login.jwt || error) {
            if (error) this.logger.error(error);
            throw new Error('Error getting login information from Amboss');
          }

          return { jwt: data.public.node_login.jwt };
        },
      ],

      createJwt: [
        'nodePubkey',
        'getAuthJwt',
        async ({ nodePubkey, getAuthJwt }): Promise<LoginAuto['createJwt']> => {
          const { data, error } =
            await this.fetchService.graphqlFetchWithProxy<{
              api_keys: { create: { token: string } };
            }>(
              this.configService.get('urls.amboss.auth'),
              CreateApiKey,
              {
                input: {
                  details: 'ThunderHub',
                  seconds: ONE_MONTH_SECONDS,
                  pubkey: nodePubkey.pubkey,
                },
              },
              { authorization: `Bearer ${getAuthJwt.jwt}` }
            );

          if (!data?.api_keys.create.token || error) {
            if (error) this.logger.error(error);
            throw new Error('Error getting login information from Amboss');
          }

          this.logger.debug('Got Amboss login token');

          return { jwt: data.api_keys.create.token };
        },
      ],
    });

    res.setHeader(
      'Set-Cookie',
      cookie.serialize(appConstants.ambossCookieName, info.createJwt.jwt, {
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
