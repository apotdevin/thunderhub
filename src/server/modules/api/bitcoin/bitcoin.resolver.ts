import { Query, Resolver } from '@nestjs/graphql';
import { FetchService } from '../../fetch/fetch.service';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { appUrls } from 'src/server/utils/appUrls';
import { BitcoinFee } from './bitcoin.types';

@Resolver()
export class BitcoinResolver {
  constructor(
    private fetchService: FetchService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => String)
  async getBitcoinPrice() {
    try {
      const response = await this.fetchService.fetchWithProxy(appUrls.ticker);
      const json = await response.json();

      return JSON.stringify(json);
    } catch (error: any) {
      this.logger.error('Error getting bitcoin price', { error });
      throw new Error('Problem getting Bitcoin price.');
    }
  }

  @Query(() => BitcoinFee)
  async getBitcoinFees() {
    try {
      const response = await this.fetchService.fetchWithProxy(appUrls.fees);
      const json = (await response.json()) as any;

      if (json) {
        const { fastestFee, halfHourFee, hourFee, minimumFee } = json;
        return {
          fast: fastestFee,
          halfHour: halfHourFee,
          hour: hourFee,
          minimum: minimumFee,
        };
      }
      throw new Error('Problem getting Bitcoin fees.');
    } catch (error: any) {
      this.logger.error('Error getting bitcoin fees', { error });
      throw new Error('Problem getting Bitcoin fees.');
    }
  }
}
