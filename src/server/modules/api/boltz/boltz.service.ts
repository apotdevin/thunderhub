import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { FetchService } from '../../fetch/fetch.service';
import { wrapFetch } from 'src/server/utils/fetch';
import {
  BroadcastTransaction,
  CreateReverseSwap,
  ReverseSwapPair,
  SwapStatus,
} from './boltz.types';

@Injectable()
export class BoltzService {
  constructor(
    private configService: ConfigService,
    private fetchService: FetchService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getPairs() {
    return wrapFetch<ReverseSwapPair>(
      this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/swap/reverse`
      ),
      10_000
    );
  }

  async getFeeEstimation() {
    return wrapFetch(
      this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/chain/BTC/fee`
      ),
      10_000
    );
  }

  async getSwapStatus(id: string) {
    return wrapFetch<SwapStatus>(
      this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/swap/${id}`
      ),
      10_000
    );
  }

  async createReverseSwap(
    invoiceAmount: number,
    preimageHash: string,
    claimPublicKey: string
  ) {
    const body = {
      from: 'BTC',
      to: 'BTC',
      referralId: 'thunderhub',
      invoiceAmount,
      preimageHash,
      claimPublicKey,
    };
    return wrapFetch<CreateReverseSwap>(
      this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/swap/reverse`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      ),
      10_000
    );
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
    const body = {
      id,
      index,
      preimage,
      pubNonce,
      transaction,
    };
    return wrapFetch(
      this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/swap/reverse/claim`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      ),
      10_000
    );
  }

  async broadcastTransaction(transactionHex: string) {
    const body = {
      hex: transactionHex,
    };
    return wrapFetch<BroadcastTransaction>(
      this.fetchService.fetchWithProxy(
        `${this.configService.get('urls.boltz')}/v2/chain/BTC/transaction`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      ),
      10_000
    );
  }
}
