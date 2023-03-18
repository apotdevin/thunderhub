import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { NostrService } from './nostr.service';
import { Keys } from './nostr.types';

@Resolver(() => Keys)
export class NostrResolver {
  constructor(private nostrService: NostrService) {}

  @Query(() => Keys, { name: 'getKeys' })
  async getKeys(@CurrentUser() { id }: UserId) {
    const key = this.nostrService.generatePrivateKey(id);
    const pub = this.nostrService.getPublicKey(key, id);
    return { pubkey: pub, privkey: key };
  }
}
