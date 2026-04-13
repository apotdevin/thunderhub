import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FetchService } from '../../fetch/fetch.service';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  AmbossUser,
  LightningNodeSocialInfo,
  OauthAuto,
  PurchaseAuto,
} from './amboss.types';
import { toWithError } from 'src/server/utils/async';
import { NodeService } from '../../node/node.service';
import { UserId } from '../../security/security.types';
import { CurrentUser } from '../../security/security.decorators';
import {
  AuthorizeDomain,
  GetLiquidityPerUsd,
  NodeLogin,
  NodeLoginInfo,
  PurchaseLiquidity,
  getNodeSocialInfo,
  getUserQuery,
} from './amboss.gql';
import { AmbossService } from './amboss.service';
import { AmbossTokenService } from './amboss-token.service';
import { auto } from 'async';
import { GraphQLError } from 'graphql';

@Resolver()
export class AmbossResolver {
  constructor(
    private nodeService: NodeService,
    private fetchService: FetchService,
    private ambossService: AmbossService,
    private ambossTokenService: AmbossTokenService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => String)
  async getLiquidityPerUsd(@CurrentUser() user: UserId) {
    const magmaUrl = await this.ambossService.resolveMagmaUrl(user);
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      market: { liquidity: { liquidity_per_usd: { sats: string } } };
    }>(magmaUrl, GetLiquidityPerUsd);

    if (!data?.market.liquidity.liquidity_per_usd.sats || error) {
      throw new GraphQLError('Unable to get liquidity information');
    }

    return data.market.liquidity.liquidity_per_usd.sats;
  }

  @Mutation(() => Boolean)
  async purchaseLiquidity(
    @CurrentUser() user: UserId,
    @Args('amount_cents') amount_cents: string
  ) {
    const magmaUrl = await this.ambossService.resolveMagmaUrl(user);
    await auto<PurchaseAuto>({
      nodeUri: async (): Promise<PurchaseAuto['nodeUri']> => {
        const [info, infoError] = await toWithError(
          this.nodeService.getWalletInfo(user.id)
        );

        if (!info?.uris.length || infoError) {
          if (infoError) this.logger.error(infoError);
          throw new GraphQLError('Error getting node information for purchase');
        }

        return info.uris[0];
      },

      ambossJwt: async (): Promise<PurchaseAuto['ambossJwt']> => {
        return this.ambossTokenService.getOrCreate(user);
      },

      liquidityInvoice: [
        'nodeUri',
        'ambossJwt',
        async ({
          nodeUri,
          ambossJwt,
        }: Pick<PurchaseAuto, 'ambossJwt' | 'nodeUri'>): Promise<
          PurchaseAuto['liquidityInvoice']
        > => {
          const { data, error } =
            await this.fetchService.graphqlFetchWithProxy<{
              liquidity: { buy: { payment: { lightning_invoice: string } } };
            }>(
              magmaUrl,
              PurchaseLiquidity,
              {
                input: {
                  usd_cents: amount_cents,
                  connection_uri: nodeUri,
                },
              },
              { authorization: `Bearer ${ambossJwt}` }
            );

          if (!data?.liquidity.buy.payment.lightning_invoice || error) {
            if (error) this.logger.error(error);
            throw new Error(
              'Error getting invoice to purchase additional liquidity'
            );
          }

          this.logger.debug('Creating new liquidity order', {
            data,
            amount_cents,
          });

          return data.liquidity.buy.payment.lightning_invoice;
        },
      ],

      pay: [
        'liquidityInvoice',
        async ({
          liquidityInvoice,
        }: Pick<PurchaseAuto, 'liquidityInvoice'>): Promise<
          PurchaseAuto['pay']
        > => {
          this.logger.info('Paying liquidity invoice', { liquidityInvoice });

          const [info, infoError] = await toWithError(
            this.nodeService.pay(user.id, { request: liquidityInvoice })
          );

          if (infoError || !info?.is_confirmed) {
            this.logger.error(`Failed to pay invoice`, { infoError, info });
            throw new GraphQLError('Failed to pay invoice for liquidity');
          }

          this.logger.info('Liquidity Invoice Paid', { info });
        },
      ],
    });

    return true;
  }

  @Query(() => AmbossUser, { nullable: true })
  async getAmbossUser(@CurrentUser() user: UserId) {
    const ambossAuth = await this.ambossTokenService.get(user);
    if (!ambossAuth) {
      this.logger.debug('getAmbossUser: no stored Amboss token', {
        userId: user.id,
      });
      return null;
    }

    const spaceUrl = await this.ambossService.resolveSpaceUrl(user);
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      spaceUrl,
      getUserQuery,
      undefined,
      { authorization: `Bearer ${ambossAuth}` }
    );

    if (error) {
      this.logger.warn('getAmbossUser: Amboss API returned error', { error });
      return null;
    }

    if (!data?.getUser) {
      this.logger.warn('getAmbossUser: Amboss API returned no user', { data });
      return null;
    }

    return data.getUser;
  }

  @Query(() => String)
  async getAmbossLoginToken(
    @CurrentUser() user: UserId,
    @Args('redirect_url', { nullable: true }) redirect_url: string | null
  ) {
    const authUrl = await this.ambossService.resolveAuthUrl(user);

    const info = await auto<OauthAuto>({
      signMessage: async (): Promise<OauthAuto['signMessage']> => {
        const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
          login: { node_login: { identifier: string; message: string } };
        }>(authUrl, NodeLoginInfo);

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
            }>(authUrl, NodeLogin, {
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
              authUrl,
              AuthorizeDomain,
              {
                input: {
                  redirect_url: redirect_url || 'https://amboss.space/oauth',
                },
              },
              { authorization: `Bearer ${getAuthJwt.jwt}` }
            );

          if (!data?.auth.authorize_domain.token_url || error) {
            if (error) this.logger.error(error);
            throw new Error('Error getting login information from Amboss');
          }

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
    @CurrentUser() user: UserId
  ) {
    const ambossAuth = await this.ambossTokenService.get(user);
    const spaceUrl = await this.ambossService.resolveSpaceUrl(user);

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      spaceUrl,
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
  async loginAmboss(@CurrentUser() user: UserId) {
    try {
      const token = await this.ambossTokenService.forceRefresh(user);
      this.logger.info('loginAmboss: stored Amboss token', {
        userId: user.id,
        tokenLength: token.length,
      });
      return true;
    } catch (err) {
      this.logger.error('loginAmboss: failed to create Amboss token', { err });
      throw err;
    }
  }

  @Mutation(() => Boolean)
  async pushBackup(@CurrentUser() user: UserId) {
    const backups = await this.nodeService.getBackups(user.id);

    const { signature } = await this.nodeService.signMessage(
      user.id,
      backups.backup
    );

    const spaceUrl = await this.ambossService.resolveSpaceUrl(user);
    await this.ambossService.pushBackup(spaceUrl, backups.backup, signature);

    return true;
  }
}
