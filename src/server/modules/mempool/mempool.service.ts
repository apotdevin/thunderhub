import { Injectable } from '@nestjs/common';
import { FetchService } from '../fetch/fetch.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MempoolService {
  constructor(
    private fetchService: FetchService,
    private config: ConfigService
  ) {}

  async getAddressTransactions(address: string): Promise<
    {
      txid: string;
      vin: { txid: string; prevout: { scriptpubkey_address: string } }[];
      vout: { scriptpubkey_address: string }[];
    }[]
  > {
    const response = await this.fetchService.fetchWithProxy(
      this.config.get('urls.mempool') + `/api/address/${address}/txs`
    );
    return (await response.json()) as any;
  }

  async getTransactionHex(transactionId: string): Promise<string> {
    const response = await this.fetchService.fetchWithProxy(
      this.config.get('urls.mempool') + `/api/tx/${transactionId}/hex`
    );
    return (await response.text()) as string;
  }

  async broadcastTransaction(transactionHex: string): Promise<string> {
    const response = await this.fetchService.fetchWithProxy(
      this.config.get('urls.mempool') + `/api/tx`,
      {
        method: 'POST',
        body: transactionHex,
        headers: { 'Content-Type': 'text/plain' },
      }
    );
    return (await response.text()) as string;
  }
}
