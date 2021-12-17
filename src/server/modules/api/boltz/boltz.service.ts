import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { appUrls } from 'src/server/utils/appUrls';
import { Logger } from 'winston';
import { FetchService } from '../../fetch/fetch.service';

@Injectable()
export class BoltzService {
  constructor(
    private fetchService: FetchService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getPairs() {
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${appUrls.boltz}/getpairs`
      );
      return response.json();
    } catch (error: any) {
      this.logger.error('Error getting pairs from Boltz', { error });
      throw new Error('ErrorGettingBoltzPairs');
    }
  }

  async getFeeEstimations() {
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${appUrls.boltz}/getfeeestimation`
      );
      return response.json();
    } catch (error: any) {
      this.logger.error('Error getting fee estimations from Boltz', { error });
      throw new Error(error);
    }
  }

  async getSwapStatus(id: string) {
    try {
      const body = { id };
      const response = await this.fetchService.fetchWithProxy(
        `${appUrls.boltz}/swapstatus`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.json();
    } catch (error: any) {
      this.logger.error('Error getting fee estimations from Boltz', { error });
      throw new Error(error);
    }
  }

  async createReverseSwap(
    invoiceAmount: number,
    preimageHash: string,
    claimPublicKey: string
  ) {
    try {
      const body = {
        type: 'reversesubmarine',
        pairId: 'BTC/BTC',
        orderSide: 'buy',
        referralId: 'thunderhub',
        invoiceAmount,
        preimageHash,
        claimPublicKey,
      };
      const response = await this.fetchService.fetchWithProxy(
        `${appUrls.boltz}/createswap`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.json();
    } catch (error: any) {
      this.logger.error('Error getting fee estimations from Boltz', { error });
      throw new Error(error);
    }
  }

  async broadcastTransaction(transactionHex: string) {
    try {
      const body = {
        currency: 'BTC',
        transactionHex,
      };
      const response = await this.fetchService.fetchWithProxy(
        `${appUrls.boltz}/broadcasttransaction`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.json();
    } catch (error: any) {
      this.logger.error('Error broadcasting transaction from Boltz', { error });
      throw new Error(error);
    }
  }
}
