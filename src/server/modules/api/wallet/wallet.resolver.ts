import { Query, Resolver } from '@nestjs/graphql';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { Wallet } from './wallet.types';

@Resolver()
export class WalletResolver {
  constructor(private nodeService: NodeService) {}

  @Query(() => Wallet)
  async getWalletInfo(@CurrentUser() { id }: UserId) {
    return this.nodeService.getWalletVersion(id);
  }
}
