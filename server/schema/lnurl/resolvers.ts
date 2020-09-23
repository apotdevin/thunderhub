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
// import { GetPublicKeyType } from 'server/types/ln-service.types';
// import hmacSHA256 from 'crypto-js/hmac-sha256';

type LnUrlPayResponseType = {
  pr?: string;
  successAction?: {};
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
    lnUrl: async (
      _: undefined,
      { type, url }: LnUrlParams,
      context: ContextType
    ): Promise<string> => {
      await requestLimiter(context.ip, 'lnUrl');

      // const fullUrl = new URL(url);

      // const { lnd } = context;

      // if (type === 'login') {
      //   logger.debug({ type, url });

      //   const info = await to<GetPublicKeyType>(
      //     getPublicKey({ lnd, family: 138, index: 0 })
      //   );

      //   const hashed = hmacSHA256(fullUrl.host, info.public_key);

      //   return info.public_key;
      // }

      logger.debug({ type, url });

      return 'confirmed';
    },
    fetchLnUrl: async (
      _: undefined,
      { url }: FetchLnUrlParams,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'fetchLnUrl');

      try {
        const response = await fetch(url);
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
        const response = await fetch(finalUrl);
        lnServiceResponse = await response.json();

        if (lnServiceResponse.status === 'ERROR') {
          throw new Error(lnServiceResponse.reason || 'LnServiceError');
        }
      } catch (error) {
        logger.error('Error withdrawing from LnUrl service: %o', error);
        throw new Error('ProblemPayingLnUrlService');
      }

      logger.debug('LnUrlWithdraw response: %o', lnServiceResponse);

      if (!lnServiceResponse.pr) {
        logger.error('No invoice in response from LnUrlService');
        throw new Error('ProblemPayingLnUrlService');
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

      const finalUrl = `${callback}?k1=${k1}&pr=${info.request}`;

      try {
        const response = await fetch(finalUrl);
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
