import { getLnMarketsAuth } from 'server/helpers/lnAuth';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { ContextType } from 'server/types/apiTypes';
import { appConstants } from 'server/utils/appConstants';
import { appUrls } from 'server/utils/appUrls';
import cookie from 'cookie';
import { LnMarketsApi } from 'server/api/LnMarkets';
import { pay, decodePaymentRequest, createInvoice } from 'ln-service';
import { to } from 'server/helpers/async';
import {
  CreateInvoiceType,
  DecodedType,
  PayInvoiceType,
} from 'server/types/ln-service.types';

export const lnMarketsResolvers = {
  Query: {
    getLnMarketsUrl: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ): Promise<string> => {
      await requestLimiter(context.ip, 'getLnMarketsUrl');
      const { lnMarketsAuth, lnd } = context;

      const { cookieString } = await getLnMarketsAuth(lnd, lnMarketsAuth);

      if (!cookieString) {
        logger.error('Error getting auth cookie from lnmarkets');
        throw new Error('ProblemAuthenticatingWithLnMarkets');
      }

      return `${appUrls.lnMarketsExchange}/login/token?token=${cookieString}`;
    },
    getLnMarketsStatus: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'getLnMarketsStatus');
      const { lnMarketsAuth } = context;

      if (!lnMarketsAuth) {
        return 'out';
      }

      const json = await LnMarketsApi.getUser(lnMarketsAuth);

      logger.debug('Get userInfo from LnMarkets: %o', json);

      if (json?.code === 'jwtExpired') {
        return 'out';
      }

      return 'in';
    },
    getLnMarketsUserInfo: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'getLnMarketsUserInfo');
      const { lnMarketsAuth } = context;

      if (!lnMarketsAuth) {
        logger.debug('Not authenticated on LnMarkets');
        throw new Error('NotAuthenticated');
      }

      const json = await LnMarketsApi.getUser(lnMarketsAuth);

      logger.debug('Get userInfo from LnMarkets: %o', json);

      if (json?.code === 'jwtExpired') {
        logger.debug('Token for LnMarkets is expired');
        throw new Error('NotAuthenticated');
      }

      return json;
    },
  },
  Mutation: {
    lnMarketsDeposit: async (
      _: undefined,
      { amount }: { amount: number },
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'lnMarketsDeposit');
      const { lnMarketsAuth, lnd } = context;

      const { cookieString } = await getLnMarketsAuth(lnd, lnMarketsAuth);

      if (!cookieString) {
        logger.error('Error getting auth cookie from lnmarkets');
        throw new Error('ProblemAuthenticatingWithLnMarkets');
      }

      const info = await LnMarketsApi.getDepositInvoice(cookieString, amount);

      logger.debug('Response from lnmarkets: %o', info);

      if (!info?.paymentRequest) {
        logger.error('Error getting deposit invoice from lnmarkets');
        throw new Error('ProblemGettingDepositInvoiceFromLnMarkets');
      }

      const decoded = await to<DecodedType>(
        decodePaymentRequest({
          lnd,
          request: info.paymentRequest,
        })
      );

      logger.debug('Decoded invoice from lnMarkets: %o', decoded);

      if (amount !== decoded.tokens) {
        logger.error(
          `Tokens in LnMarkets invoice ${decoded.tokens} is different to requested ${amount}`
        );
        throw new Error('WrongAmountInLnMarketsInvoice');
      }

      await to<PayInvoiceType>(pay({ lnd, request: info.paymentRequest }));

      return true;
    },
    lnMarketsWithdraw: async (
      _: undefined,
      { amount }: { amount: number },
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'lnMarketsWithdraw');
      const { lnMarketsAuth, lnd } = context;

      const { cookieString } = await getLnMarketsAuth(lnd, lnMarketsAuth);

      if (!cookieString) {
        logger.error('Error getting auth cookie from lnmarkets');
        throw new Error('ProblemAuthenticatingWithLnMarkets');
      }

      const invoice = await to<CreateInvoiceType>(
        createInvoice({
          lnd,
          description: 'LnMarkets Withdraw',
          tokens: amount,
        })
      );

      const response = await LnMarketsApi.withdraw(
        cookieString,
        amount,
        invoice.request
      );

      logger.debug('Withdraw request from LnMarkets: %o', response);

      return true;
    },
    lnMarketsLogin: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'lnMarketsLogin');
      const { lnd, res } = context;

      const { cookieString, json } = await getLnMarketsAuth(lnd);

      if (!json || !cookieString) {
        throw new Error('ProblemAuthenticatingWithLnMarkets');
      }

      if (json.status === 'ERROR') {
        return { ...json, message: json.reason || 'LnServiceError' };
      }

      res.setHeader(
        'Set-Cookie',
        cookie.serialize(appConstants.lnMarketsAuth, cookieString, {
          httpOnly: true,
          sameSite: true,
          path: '/',
        })
      );

      return { ...json, message: 'LnMarketsAuthSuccess' };
    },
    lnMarketsLogout: async (_: undefined, __: any, context: ContextType) => {
      const { ip, res } = context;
      await requestLimiter(ip, 'lnMarketsLogout');

      res.setHeader(
        'Set-Cookie',
        cookie.serialize(appConstants.lnMarketsAuth, '', {
          maxAge: -1,
          httpOnly: true,
          sameSite: true,
          path: '/',
        })
      );
      return true;
    },
  },
};
