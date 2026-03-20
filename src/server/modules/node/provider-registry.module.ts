import { Module } from '@nestjs/common';
import { LndModule } from './lnd/lnd.module';
import { LitdModule } from './litd/litd.module';
import { ProviderRegistryService } from './provider-registry.service';

@Module({
  imports: [LndModule, LitdModule],
  providers: [ProviderRegistryService],
  exports: [ProviderRegistryService],
})
export class ProviderRegistryModule {}
