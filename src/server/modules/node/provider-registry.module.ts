import { Module } from '@nestjs/common';
import { LndModule } from './lnd/lnd.module';
import { ProviderRegistryService } from './provider-registry.service';

@Module({
  imports: [LndModule],
  providers: [ProviderRegistryService],
  exports: [ProviderRegistryService],
})
export class ProviderRegistryModule {}
