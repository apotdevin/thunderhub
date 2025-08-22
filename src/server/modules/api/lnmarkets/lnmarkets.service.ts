import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { bech32 } from 'bech32';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { FetchService } from '../../fetch/fetch.service';
import { LnUrlService } from '../lnurl/lnurl.service';

const decodeLnUrl = (url: string): string => {
  const cleanUrl = url.toLowerCase().replace('lightning:', '');
  const { words } = bech32.decode(cleanUrl, 500);
  const bytes = bech32.fromWords(words);
  return new String(Buffer.from(bytes)).toString();
};

@Injectable()
export class LnMarketsService {
  constructor(
    private configService: ConfigService,
    private fetchService: FetchService,
    private lnUrlService: LnUrlService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getUser(token: string) {
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.lnMarkets')}/user`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return (await response.json()) as any;
    } catch (error: any) {
      this.logger.error(
        `Error getting user info from ${this.configService.get(
          'urls.lnMarkets'
        )}/user`,
        { error }
      );
      throw new Error('ProblemAuthenticatingWithLnMarkets');
    }
  }

  async getDepositInvoice(token: string, amount: number) {
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.lnMarkets')}/user/deposit`,
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({ amount, unit: 'sat' }),
        }
      );
      return (await response.json()) as any;
    } catch (error: any) {
      this.logger.error(`Error getting invoice to deposit from LnMarkets`, {
        error,
      });
      throw new Error('ProblemGettingDepositInvoice');
    }
  }

  async withdraw(token: string, amount: number, invoice: string) {
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.lnMarkets')}/user/withdraw`,
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({ amount, unit: 'sat', invoice }),
        }
      );
      return (await response.json()) as any;
    } catch (error: any) {
      this.logger.error(`Error withdrawing from LnMarkets`, { error });
      throw new Error('ProblemWithdrawingFromLnMarkets');
    }
  }

  async getLnMarketsAuth(
    id: string,
    cookie?: string | null
  ): Promise<{
    newCookie: boolean;
    cookieString?: string;
    json?: { status: string; reason: string; token: string };
  }> {
    if (cookie) {
      return { newCookie: false, cookieString: cookie };
    }

    if (!id) {
      this.logger.error(
        'Error getting authenticated LND instance in lnUrlAuth'
      );
      throw new Error('ProblemAuthenticatingWithLnUrlService');
    }

    let lnUrl = '';

    // Get a new lnUrl from LnMarkets
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.lnMarkets')}/lnurl/auth`,
        {
          method: 'post',
        }
      );
      const json = (await response.json()) as any;

      this.logger.debug('Get lnUrl from LnMarkets response', { json });
      lnUrl = json?.lnurl;
      if (!lnUrl) throw new Error();
    } catch (error: any) {
      this.logger.error(
        `Error getting lnAuth url from ${this.configService.get(
          'urls.lnMarkets'
        )}`,
        {
          error,
        }
      );
      throw new Error('ProblemAuthenticatingWithLnMarkets');
    }

    // Decode the LnUrl and authenticate with it
    const decoded = decodeLnUrl(lnUrl);
    const finalUrl = await this.lnUrlService.lnAuthUrlGenerator(id, decoded);

    // Try to authenticate with lnMarkets
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${finalUrl}&jwt=true&expiry=3600`
      );
      const json = (await response.json()) as any;

      this.logger.debug('LnUrlAuth response', { json });

      if (!json?.token) {
        throw new Error('No token in response');
      }

      return { newCookie: true, cookieString: json.token, json };
    } catch (error: any) {
      this.logger.error('Error authenticating with LnUrl service', { error });
      throw new Error('ProblemAuthenticatingWithLnUrlService');
    }
  }
}
