import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module';
import { ProviderRegistryModule } from '../node/provider-registry.module';
import { AccountsService } from './accounts.service';

@Module({
  imports: [FilesModule, ProviderRegistryModule],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
