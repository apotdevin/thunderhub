import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { FetchService } from '../../fetch/fetch.service';

@Injectable()
export class BoltzService {
  constructor(
    private configService: ConfigService,
    private fetchService: FetchService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getPairs() {
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/swap/reverse`
      );
      return response.json();
    } catch (error: any) {
      this.logger.error('Error getting pairs from Boltz', { error });
      throw new Error('ErrorGettingBoltzPairs');
    }
  }

  async getFeeEstimation() {
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/chain/BTC/fee`
      );
      return response.json();
    } catch (error: any) {
      this.logger.error('Error getting fee estimations from Boltz', { error });
      throw new Error(error);
    }
  }

  async getSwapStatus(id: string) {
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/swap/${id}`
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
        from: 'BTC',
        to: 'BTC',
        referralId: 'thunderhub',
        invoiceAmount,
        preimageHash,
        claimPublicKey,
      };
      const response = await this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/swap/reverse`,
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

  async getReverseSwapClaimSignature(
    id: string,
    preimage: string,
    transaction: string,
    index: number,
    pubNonce: string
  ): Promise<{
    pubNonce: string;
    partialSignature: string;
  }> {
    try {
      const body = {
        id,
        index,
        preimage,
        pubNonce,
        transaction,
      };
      const response = await this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/swap/reverse/claim`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.json();
    } catch (error: any) {
      this.logger.error('Error getting partial claim signature from Boltz', {
        error,
      });
      throw new Error(error);
    }
  }

  async broadcastTransaction(transactionHex: string) {
    try {
      const body = {
        hex: transactionHex,
      };
      const response = await this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/chain/BTC/transaction`,
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
