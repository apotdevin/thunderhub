import { Module } from '@nestjs/common';
import { LndModule } from './lnd/lnd.module';
import { LdkServerModule } from './ldk-server/ldk-server.module';
import { ProviderRegistryService } from './provider-registry.service';

@Module({
  imports: [LndModule, LdkServerModule],
  providers: [ProviderRegistryService],
  exports: [ProviderRegistryService],
})
export class ProviderRegistryModule {}
