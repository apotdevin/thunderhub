import { Module } from '@nestjs/common';
import { LndModule } from './lnd/lnd.module';
import { LitdModule } from './litd/litd.module';
import { LdkServerModule } from './ldk-server/ldk-server.module';
import { ProviderRegistryService } from './provider-registry.service';

@Module({
  imports: [LndModule, LitdModule, LdkServerModule],
  providers: [ProviderRegistryService],
  exports: [ProviderRegistryService],
})
export class ProviderRegistryModule {}
