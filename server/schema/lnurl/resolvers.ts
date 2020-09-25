import { randomBytes } from 'crypto';
import { to } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { ContextType } from 'server/types/apiTypes';
import {
  createInvoice,
  decodePaymentRequest,
  pay,
  getWalletInfo,
  diffieHellmanComputeSecret,
} from 'ln-service';
import {
  CreateInvoiceType,
  DecodedType,
  DiffieHellmanComputeSecretType,
  GetWalletInfoType,
  PayInvoiceType,
} from 'server/types/ln-service.types';

import hmacSHA256 from 'crypto-js/hmac-sha256';
import { enc } from 'crypto-js';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as secp256k1 from 'secp256k1';
import { BIP32Interface } from 'bip32';

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

const fromHexString = (hexString: string) =>
  new Uint8Array(
    hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  );

const toHexString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const lnUrlResolvers = {
  Mutation: {
    lnUrlAuth: async (
      _: undefined,
      { url }: LnUrlParams,
      context: ContextType
    ): Promise<{ status: string; message: string }> => {
      await requestLimiter(context.ip, 'lnUrl');
      const { lnd } = context;

      const domainUrl = new URL(url);
      const host = domainUrl.host;

      const k1 = domainUrl.searchParams.get('k1');

      if (!host || !k1) {
        logger.error('Missing host or k1 in url: %o', url);
        throw new Error('WrongUrlFormat');
      }

      const wallet = await to<GetWalletInfoType>(getWalletInfo({ lnd }));

      // Generate entropy
      const secret = await to<DiffieHellmanComputeSecretType>(
        diffieHellmanComputeSecret({
          lnd,
          key_family: 138,
          key_index: 0,
          partner_public_key: wallet?.public_key,
        })
      );

      // Generate hash from host and entropy
      const hashed = hmacSHA256(host, secret.secret).toString(enc.Hex);

      const indexes =
        hashed.match(/.{1,4}/g)?.map(index => parseInt(index, 16)) || [];

      // Generate private seed from entropy
      const secretKey = bip39.entropyToMnemonic(hashed);
      const base58 = bip39.mnemonicToSeedSync(secretKey);

      // Derive private seed from previous private seed and path
      const node: BIP32Interface = bip32.fromSeed(base58);
      const derived = node.derivePath(
        `m/138/${indexes[0]}/${indexes[1]}/${indexes[2]}/${indexes[3]}`
      );

      // Get private and public key from derived private seed
      const privateKey = derived.privateKey?.toString('hex');
      const linkingKey = derived.publicKey.toString('hex');

      if (!privateKey || !linkingKey) {
        logger.error('Error deriving private or public key: %o', url);
        throw new Error('ErrorDerivingPrivateKey');
      }

      // Sign k1 with derived private seed
      const sigObj = secp256k1.ecdsaSign(
        fromHexString(k1),
        fromHexString(privateKey)
      );

      // Get signature
      const signature = secp256k1.signatureExport(sigObj.signature);
      const encodedSignature = toHexString(signature);

      // Build final url with signature and public key
      const finalUrl = `${url}&sig=${encodedSignature}&key=${linkingKey}`;

      try {
        const response = await fetch(finalUrl);
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
