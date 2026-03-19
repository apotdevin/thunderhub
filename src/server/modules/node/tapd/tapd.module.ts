import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { ProviderRegistryModule } from '../provider-registry.module';
import { TapdNodeService } from './tapd-node.service';

@Module({
  imports: [ProviderRegistryModule, AccountsModule],
  providers: [TapdNodeService],
  exports: [TapdNodeService],
})
export class TapdModule {}
