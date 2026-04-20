import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { ProviderRegistryModule } from '../provider-registry.module';
import { NodeModule } from '../node.module';
import { TapdNodeService } from './tapd-node.service';

@Module({
  imports: [ProviderRegistryModule, AccountsModule, NodeModule],
  providers: [TapdNodeService],
  exports: [TapdNodeService],
})
export class TapdModule {}
