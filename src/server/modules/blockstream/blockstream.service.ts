import { Injectable } from '@nestjs/common';
import { FetchService } from '../fetch/fetch.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlockstreamService {
  constructor(
    private fetchService: FetchService,
    private config: ConfigService
  ) {}

  async broadcastTransaction(transactionHex: string): Promise<string> {
    const response = await this.fetchService.fetchWithProxy(
      this.config.get('urls.blockstream') + `/api/tx`,
      {
        method: 'POST',
        body: transactionHex,
        headers: { 'Content-Type': 'text/plain' },
      }
    );
    return (await response.text()) as string;
  }
}
