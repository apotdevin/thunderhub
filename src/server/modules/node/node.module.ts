import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { ProviderRegistryModule } from './provider-registry.module';
import { NodeService } from './node.service';

@Module({
  imports: [ProviderRegistryModule, AccountsModule],
  providers: [NodeService],
  exports: [NodeService, ProviderRegistryModule],
})
export class NodeModule {}
