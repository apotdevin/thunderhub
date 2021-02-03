import { randomBytes } from 'crypto';
import { to } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { ContextType } from 'server/types/apiTypes';
import { createInvoice, decodePaymentRequest, pay } from 'ln-service';
import {
  CreateInvoiceType,
  DecodedType,
  PayInvoiceType,
} from 'server/types/ln-service.types';
import { lnAuthUrlGenerator } from 'server/helpers/lnAuth';
import { fetchWithProxy } from 'server/utils/fetch';

type LnUrlPayResponseType = {
  pr?: string;
  successAction?: { tag: string };
  status?: string;
  reason?: string;
};

type LnUrlParams = {
  type: string;
  url: string;
};

type FetchLnUrlParams = {
  url: string;
};

type LnUrlPayType = { callback: string; amount: number; comment: string };
type LnUrlWithdrawType = {
  callback: string;
  k1: string;
  amount: number;
  description: string;
};

type PayRequestType = {
  callback: string;
  maxSendable: string;
  minSendable: string;
  metadata: string;
  commentAllowed: number;
  tag: string;
};

type WithdrawRequestType = {
  callback: string;
  k1: string;
  maxWithdrawable: string;
  defaultDescription: string;
  minWithdrawable: string;
  tag: string;
};

type RequestType = PayRequestType | WithdrawRequestType;
type RequestWithType = { isTypeOf: string } & RequestType;

export const lnUrlResolvers = {
  Mutation: {
    lnUrlAuth: async (
      _: undefined,
      { url }: LnUrlParams,
      context: ContextType
    ): Promise<{ status: string; message: string }> => {
      await requestLimiter(context.ip, 'lnUrl');
      const { lnd } = context;

      if (!lnd) {
        logger.error('Error getting authenticated LND instance in lnUrlAuth');
        throw new Error('ProblemAuthenticatingWithLnUrlService');
      }

      const finalUrl = await lnAuthUrlGenerator(url, lnd);

      try {
        const response = await fetchWithProxy(finalUrl);
        const json = await response.json();

        logger.debug('LnUrlAuth response: %o', json);

        if (json.status === 'ERROR') {
          return { ...json, message: json.reason || 'LnServiceError' };
        }

        return { ...json, message: json.event || 'LnServiceSuccess' };
      } catch (error) {
        logger.error('Error authenticating with LnUrl service: %o', error);
        throw new Error('ProblemAuthenticatingWithLnUrlService');
      }
    },
    fetchLnUrl: async (
      _: undefined,
      { url }: FetchLnUrlParams,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'fetchLnUrl');

      try {
        const response = await fetchWithProxy(url);
        const json = await response.json();

        if (json.status === 'ERROR') {
          throw new Error(json.reason || 'LnServiceError');
        }

        return json;
      } catch (error) {
        logger.error('Error fetching from LnUrl service: %o', error);
        throw new Error('ProblemFetchingFromLnUrlService');
      }
    },
    lnUrlPay: async (
      _: undefined,
      { callback, amount, comment }: LnUrlPayType,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'lnUrlPay');
      const { lnd } = context;

      logger.debug('LnUrlPay initiated with params %o', {
        callback,
        amount,
        comment,
      });

      const random8byteNonce = randomBytes(8).toString('hex');

      const finalUrl = `${callback}?amount=${
        amount * 1000
      }&nonce=${random8byteNonce}&comment=${comment}`;

      let lnServiceResponse: LnUrlPayResponseType = {
        status: 'ERROR',
        reason: 'FailedToFetchLnService',
      };

      try {
        const response = await fetchWithProxy(finalUrl);
        lnServiceResponse = await response.json();

        if (lnServiceResponse.status === 'ERROR') {
          throw new Error(lnServiceResponse.reason || 'LnServiceError');
        }
      } catch (error) {
        logger.error('Error paying to LnUrl service: %o', error);
        throw new Error('ProblemPayingLnUrlService');
      }

      logger.debug('LnUrlPay response: %o', lnServiceResponse);

      if (!lnServiceResponse.pr) {
        logger.error('No invoice in response from LnUrlService');
        throw new Error('ProblemPayingLnUrlService');
      }

      if (lnServiceResponse.successAction) {
        const { tag } = lnServiceResponse.successAction;
        if (tag !== 'url' && tag !== 'message' && tag !== 'aes') {
          logger.error('LnUrlService provided an invalid tag: %o', tag);
          throw new Error('InvalidTagFromLnUrlService');
        }
      }

      const decoded = await to<DecodedType>(
        decodePaymentRequest({
          lnd,
          request: lnServiceResponse.pr,
        })
      );

      if (decoded.tokens > amount) {
        logger.error(
          `Invoice amount ${decoded.tokens} is higher than amount defined ${amount}`
        );
        throw new Error('LnServiceInvoiceAmountToHigh');
      }

      const info = await to<PayInvoiceType>(
        pay({ lnd, request: lnServiceResponse.pr })
      );

      if (!info.is_confirmed) {
        logger.error(`Failed to pay invoice: ${lnServiceResponse.pr}`);
        throw new Error('FailedToPayInvoiceToLnUrlService');
      }

      return (
        lnServiceResponse.successAction || {
          tag: 'message',
          message: 'Succesfully Paid',
        }
      );
    },
    lnUrlWithdraw: async (
      _: undefined,
      { callback, k1, amount, description }: LnUrlWithdrawType,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'lnUrlWithdraw');
      const { lnd } = context;

      logger.debug('LnUrlWithdraw initiated with params: %o', {
        callback,
        amount,
        k1,
        description,
      });

      // Create invoice to be paid by LnUrlService
      const info = await to<CreateInvoiceType>(
        createInvoice({ lnd, tokens: amount, description })
      );

      // If the callback url already has an initial query '?' identifier we don't need to add it again.
      const initialIdentifier = callback.indexOf('?') != -1 ? '&' : '?';

      const finalUrl = `${callback}${initialIdentifier}k1=${k1}&pr=${info.request}`;

      try {
        const response = await fetchWithProxy(finalUrl);
        const json = await response.json();

        logger.debug('LnUrlWithdraw response: %o', json);

        if (json.status === 'ERROR') {
          throw new Error(json.reason || 'LnServiceError');
        }

        // Return invoice id to check status
        return info.id;
      } catch (error) {
        logger.error('Error withdrawing from LnUrl service: %o', error);
        throw new Error('ProblemWithdrawingFromLnUrlService');
      }
    },
  },
  LnUrlRequest: {
    __resolveType(parent: RequestWithType) {
      if (parent.tag === 'payRequest') {
        return 'PayRequest';
      }
      if (parent.tag === 'withdrawRequest') {
        return 'WithdrawRequest';
      }
      return 'Unknown';
    },
  },
};
