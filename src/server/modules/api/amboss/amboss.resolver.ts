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
  OauthAuto,
  PurchaseAuto,
} from './amboss.types';
import { ConfigService } from '@nestjs/config';
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
import { AmbossService, ONE_MONTH_SECONDS } from './amboss.service';
import { auto } from 'async';
import { GraphQLError } from 'graphql';

@Resolver()
export class AmbossResolver {
  constructor(
    private nodeService: NodeService,
    private configService: ConfigService,
    private fetchService: FetchService,
    private ambossService: AmbossService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => String)
  async getLiquidityPerUsd() {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      market: { liquidity: { liquidity_per_usd: { sats: string } } };
    }>(this.configService.get('urls.amboss.magma'), GetLiquidityPerUsd);

    if (!data?.market.liquidity.liquidity_per_usd.sats || error) {
      throw new GraphQLError('Unable to get liquidity information');
    }

    return data.market.liquidity.liquidity_per_usd.sats;
  }

  @Mutation(() => Boolean)
  async purchaseLiquidity(
    @CurrentUser() user: UserId,
    @Context() { ambossAuth, res }: ContextType,
    @Args('amount_cents') amount_cents: string
  ) {
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
        if (ambossAuth) return ambossAuth;

        const jwt = await this.ambossService.getAmbossJWT(user.id);

        res.setHeader(
          'Set-Cookie',
          cookie.serialize(appConstants.ambossCookieName, jwt, {
            maxAge: ONE_MONTH_SECONDS,
            httpOnly: true,
            sameSite: true,
            path: '/',
          })
        );

        return jwt;
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
              this.configService.get('urls.amboss.magma'),
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
  async getAmbossLoginToken(
    @CurrentUser() user: UserId,
    @Args('redirect_url', { nullable: true }) redirect_url: string | null
  ) {
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
    const jwt = await this.ambossService.getAmbossJWT(user.id);

    res.setHeader(
      'Set-Cookie',
      cookie.serialize(appConstants.ambossCookieName, jwt, {
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
