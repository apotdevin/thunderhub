import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { PeerSwapModule } from '../peerswap/peerswap.module';
import { LndModule } from './lnd/lnd.module';
import { NodeService } from './node.service';

@Module({
  imports: [LndModule, AccountsModule, PeerSwapModule],
  providers: [NodeService],
  exports: [NodeService],
})
export class NodeModule {}
