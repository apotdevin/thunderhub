import { Inject, Logger } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ContextType } from 'src/server/app.module';
import { appConstants } from 'src/server/utils/appConstants';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { LnMarketsService } from './lnmarkets.service';
import cookie from 'cookie';
import { AuthResponse } from '../lnurl/lnurl.types';
import { LnMarketsUserInfo } from './lnmarkets.types';
import { ConfigService } from '@nestjs/config';

@Resolver()
export class LnMarketsResolver {
  constructor(
    private configService: ConfigService,
    private nodeService: NodeService,
    private lnmarketsService: LnMarketsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => String)
  async getLnMarketsUrl(
    @CurrentUser() user: UserId,
    @Context() { lnMarketsAuth }: ContextType
  ) {
    const { cookieString } = await this.lnmarketsService.getLnMarketsAuth(
      user.id,
      lnMarketsAuth
    );

    if (!cookieString) {
      this.logger.error('Error getting auth cookie from lnmarkets');
      throw new Error('ProblemAuthenticatingWithLnMarkets');
    }

    return `${this.configService.get(
      'urls.lnMarketsExchange'
    )}/login/token?token=${cookieString}`;
  }

  @Query(() => String)
  async getLnMarketsStatus(@Context() { lnMarketsAuth }: ContextType) {
    if (!lnMarketsAuth) {
      return 'out';
    }

    const json = await this.lnmarketsService.getUser(lnMarketsAuth);

    this.logger.debug('Get userInfo from LnMarkets', { json });

    if (json?.code === 'jwtExpired') {
      return 'out';
    }

    return 'in';
  }

  @Query(() => LnMarketsUserInfo)
  async getLnMarketsUserInfo(@Context() { lnMarketsAuth }: ContextType) {
    if (!lnMarketsAuth) {
      this.logger.debug('Not authenticated on LnMarkets');
      throw new Error('NotAuthenticated');
    }

    const json = await this.lnmarketsService.getUser(lnMarketsAuth);

    this.logger.debug('Get userInfo from LnMarkets', { json });

    if (json?.code === 'jwtExpired') {
      this.logger.debug('Token for LnMarkets is expired');
      throw new Error('NotAuthenticated');
    }

    return json;
  }

  @Mutation(() => Boolean)
  async lnMarketsDeposit(
    @CurrentUser() user: UserId,
    @Context() { lnMarketsAuth }: ContextType,
    @Args('amount') amount: number
  ) {
    const { cookieString } = await this.lnmarketsService.getLnMarketsAuth(
      user.id,
      lnMarketsAuth
    );

    if (!cookieString) {
      this.logger.error('Error getting auth cookie from lnmarkets');
      throw new Error('ProblemAuthenticatingWithLnMarkets');
    }

    const info = await this.lnmarketsService.getDepositInvoice(
      cookieString,
      amount
    );

    this.logger.debug('Response from lnmarkets', { info });

    if (!info?.paymentRequest) {
      this.logger.error('Error getting deposit invoice from lnmarkets');
      throw new Error('ProblemGettingDepositInvoiceFromLnMarkets');
    }

    const decoded = await this.nodeService.decodePaymentRequest(
      user.id,
      info.paymentRequest
    );

    this.logger.debug('Decoded invoice from lnMarkets', { decoded });

    if (amount !== decoded.tokens) {
      this.logger.error(
        `Tokens in LnMarkets invoice ${decoded.tokens} is different to requested ${amount}`
      );
      throw new Error('WrongAmountInLnMarketsInvoice');
    }

    await this.nodeService.pay(user.id, { request: info.paymentRequest });

    return true;
  }

  @Mutation(() => Boolean)
  async lnMarketsWithdraw(
    @CurrentUser() user: UserId,
    @Context() { lnMarketsAuth }: ContextType,
    @Args('amount') amount: number
  ) {
    const { cookieString } = await this.lnmarketsService.getLnMarketsAuth(
      user.id,
      lnMarketsAuth
    );

    if (!cookieString) {
      this.logger.error('Error getting auth cookie from lnmarkets');
      throw new Error('ProblemAuthenticatingWithLnMarkets');
    }

    const invoice = await this.nodeService.createInvoice(user.id, {
      description: 'LnMarkets Withdraw',
      tokens: amount,
    });

    const response = await this.lnmarketsService.withdraw(
      cookieString,
      amount,
      invoice.request
    );

    this.logger.debug('Withdraw request from LnMarkets', { response });

    return true;
  }

  @Mutation(() => AuthResponse)
  async lnMarketsLogin(
    @CurrentUser() user: UserId,
    @Context() { res }: ContextType
  ) {
    const { cookieString, json } = await this.lnmarketsService.getLnMarketsAuth(
      user.id
    );

    if (!json || !cookieString) {
      throw new Error('ProblemAuthenticatingWithLnMarkets');
    }

    if (json.status === 'ERROR') {
      return { ...json, message: json.reason || 'LnServiceError' };
    }

    const isProduction = this.configService.get('isProduction');
    res.setHeader(
      'Set-Cookie',
      cookie.serialize(appConstants.lnMarketsAuth, cookieString, {
        httpOnly: true,
        sameSite: true,
        path: '/',
        secure: isProduction,
      })
    );

    return { ...json, message: 'LnMarketsAuthSuccess' };
  }

  @Mutation(() => Boolean)
  async lnMarketsLogout(@Context() { res }: ContextType) {
    const isProduction = this.configService.get('isProduction');
    res.setHeader(
      'Set-Cookie',
      cookie.serialize(appConstants.lnMarketsAuth, '', {
        maxAge: -1,
        httpOnly: true,
        sameSite: true,
        path: '/',
        secure: isProduction,
      })
    );
    return true;
  }
}
