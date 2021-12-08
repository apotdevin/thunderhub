import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { LndModule } from './lnd/lnd.module';
import { NodeService } from './node.service';

@Module({
  imports: [LndModule, AccountsModule],
  providers: [NodeService],
  exports: [NodeService],
})
export class NodeModule {}
