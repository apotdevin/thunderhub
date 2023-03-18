import { Injectable } from '@nestjs/common';
import * as nostr from 'nostr-tools';
import { AccountsService } from '../../accounts/accounts.service';

@Injectable()
export class NostrService {
  constructor(private accountService: AccountsService) {}

  generatePrivateKey(id: string) {
    const account = this.accountService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return nostr.generatePrivateKey();
  }

  getPublicKey(privateKey: string, id: string) {
    const account = this.accountService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return nostr.getPublicKey(privateKey);
  }
}
