import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { FetchService } from '../../fetch/fetch.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { LnUrlService } from './lnurl.service';
import {
  AuthResponse,
  LnUrlPayResponseType,
  LnUrlRequestUnion,
  PayRequest,
  PaySuccess,
} from './lnurl.types';
import { Logger } from 'winston';
import { randomBytes } from 'crypto';
import { NodeService } from '../../node/node.service';

const validateCallbackUrl = (url: string): void => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid callback URL');
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('Callback URL must use HTTPS');
  }

  const hostname = parsed.hostname;

  // Block private/internal IPs
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '0.0.0.0' ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('169.254.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    throw new Error('Callback URL points to a private network');
  }
};

@Resolver()
export class LnUrlResolver {
  constructor(
    private fetchService: FetchService,
    private lnUrlService: LnUrlService,
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => PayRequest)
  async getLightningAddressInfo(@Args('address') address: string) {
    const split = address.split('@');

    if (split.length !== 2) {
      throw new Error('Invalid lightning address');
    }

    try {
      const response = await this.fetchService.fetchWithProxy(
        `https://${split[1]}/.well-known/lnurlp/${split[0]}`
      );
      const result = await response.json();

      let valid = true;
      if (!result.callback) valid = false;
      if (!result.maxSendable) valid = false;
      if (!result.minSendable) valid = false;

      if (!valid) {
        throw new Error('Invalid lightning address');
      }

      return result;
    } catch (error) {
      throw new Error('Invalid lightning address');
    }
  }

  @Mutation(() => AuthResponse)
  async lnUrlAuth(@CurrentUser() { id }: UserId, @Args('url') url: string) {
    const finalUrl = await this.lnUrlService.lnAuthUrlGenerator(id, url);

    try {
      const response = await this.fetchService.fetchWithProxy(finalUrl);
      const json = (await response.json()) as any;

      this.logger.debug('LnUrlAuth response', { json });

      if (json.status === 'ERROR') {
        return { ...json, message: json.reason || 'LnServiceError' };
      }

      return { ...json, message: json.event || 'LnServiceSuccess' };
    } catch (error: any) {
      this.logger.error('Error authenticating with LnUrl service', { error });
      throw new Error('ProblemAuthenticatingWithLnUrlService');
    }
  }

  @Mutation(() => LnUrlRequestUnion)
  async fetchLnUrl(@Args('url') url: string) {
    try {
      const response = await this.fetchService.fetchWithProxy(url);
      const json = (await response.json()) as any;

      if (json.status === 'ERROR') {
        throw new Error(json.reason || 'LnServiceError');
      }

      return json;
    } catch (error: any) {
      this.logger.error('Error fetching from LnUrl service', { error });
      throw new Error('ProblemFetchingFromLnUrlService');
    }
  }

  @Mutation(() => PaySuccess)
  async lnUrlPay(
    @CurrentUser() { id }: UserId,
    @Args('callback') callback: string,
    @Args('amount') amount: number,
    @Args('comment', { nullable: true }) comment: string
  ) {
    validateCallbackUrl(callback);

    this.logger.debug('LnUrlPay initiated with params', {
      callback,
      amount,
      comment,
    });

    const random8byteNonce = randomBytes(8).toString('hex');

    // If the callback url already has an initial query '?' identifier we don't need to add it again.
    const initialIdentifier = callback.indexOf('?') != -1 ? '&' : '?';

    const finalUrl = `${callback}${initialIdentifier}amount=${
      amount * 1000
    }&nonce=${random8byteNonce}&comment=${comment}`;

    let lnServiceResponse: LnUrlPayResponseType = {
      status: 'ERROR',
      reason: 'FailedToFetchLnService',
    };

    try {
      const response = await this.fetchService.fetchWithProxy(finalUrl);
      lnServiceResponse = (await response.json()) as any;

      if (lnServiceResponse.status === 'ERROR') {
        throw new Error(lnServiceResponse.reason || 'LnServiceError');
      }
    } catch (error: any) {
      this.logger.error('Error paying to LnUrl service', { error });
      throw new Error('ProblemPayingLnUrlService');
    }

    this.logger.debug('LnUrlPay response', { response: lnServiceResponse });

    if (!lnServiceResponse.pr) {
      this.logger.error('No invoice in response from LnUrlService');
      throw new Error('ProblemPayingLnUrlService');
    }

    if (lnServiceResponse.successAction) {
      const { tag } = lnServiceResponse.successAction;
      if (tag !== 'url' && tag !== 'message' && tag !== 'aes') {
        this.logger.error('LnUrlService provided an invalid tag', { tag });
        throw new Error('InvalidTagFromLnUrlService');
      }
    }

    const decoded = await this.nodeService.decodePaymentRequest(
      id,
      lnServiceResponse.pr
    );

    if (decoded.tokens > amount) {
      this.logger.error(
        `Invoice amount ${decoded.tokens} is higher than amount defined ${amount}`
      );
      throw new Error('LnServiceInvoiceAmountToHigh');
    }

    const info = await this.nodeService.pay(id, {
      request: lnServiceResponse.pr,
    });

    if (!info.is_confirmed) {
      this.logger.error(`Failed to pay invoice: ${lnServiceResponse.pr}`);
      throw new Error('FailedToPayInvoiceToLnUrlService');
    }

    return (
      lnServiceResponse.successAction || {
        tag: 'message',
        message: 'Succesfully Paid',
      }
    );
  }

  @Mutation(() => String)
  async lnUrlWithdraw(
    @CurrentUser() { id }: UserId,
    @Args('callback') callback: string,
    @Args('amount') amount: number,
    @Args('description', { nullable: true }) description: string,
    @Args('k1') k1: string
  ) {
    validateCallbackUrl(callback);

    this.logger.debug('LnUrlWithdraw initiated with params', {
      callback,
      amount,
      k1,
      description,
    });

    // Create invoice to be paid by LnUrlService
    const info = await this.nodeService.createInvoice(id, {
      tokens: amount,
      description,
    });

    // If the callback url already has an initial query '?' identifier we don't need to add it again.
    const initialIdentifier = callback.indexOf('?') != -1 ? '&' : '?';

    const finalUrl = `${callback}${initialIdentifier}k1=${k1}&pr=${info.request}`;

    try {
      const response = await this.fetchService.fetchWithProxy(finalUrl);
      const json = (await response.json()) as any;

      this.logger.debug('LnUrlWithdraw response', { json });

      if (json.status === 'ERROR') {
        throw new Error(json.reason || 'LnServiceError');
      }

      // Return invoice id to check status
      return info.id;
    } catch (error: any) {
      this.logger.error('Error withdrawing from LnUrl service', { error });
      throw new Error('ProblemWithdrawingFromLnUrlService');
    }
  }

  @Mutation(() => String)
  async lnUrlChannel(
    @CurrentUser() { id }: UserId,
    @Args('callback') callback: string,
    @Args('uri') uri: string,
    @Args('k1') k1: string
  ) {
    validateCallbackUrl(callback);

    this.logger.debug('LnUrlChannel initiated with params', {
      callback,
      uri,
      k1,
    });

    const split = uri.split('@');

    await this.nodeService.addPeer(id, split[0], split[1], false);

    const info = await this.nodeService.getWalletInfo(id);

    // If the callback url already has an initial query '?' identifier we don't need to add it again.
    const initialIdentifier = callback.indexOf('?') != -1 ? '&' : '?';

    const finalUrl = `${callback}${initialIdentifier}k1=${k1}&remoteid=${info.public_key}&private=0`;

    try {
      const response = await this.fetchService.fetchWithProxy(finalUrl);
      const json = (await response.json()) as any;

      this.logger.debug('LnUrlChannel response', { json });

      if (json.status === 'ERROR') {
        throw new Error(json.reason || 'LnServiceError');
      }

      return 'Successfully requested a channel open';
    } catch (error: any) {
      this.logger.error('Error requesting channel from LnUrl service', {
        error,
      });
      throw new Error(`Error requesting channel from LnUrl service: ${error}`);
    }
  }
}
