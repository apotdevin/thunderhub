import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import { FetchModule } from '../../fetch/fetch.module';
import { AccountsModule } from '../../accounts/accounts.module';
import { ProviderRegistryModule } from '../../node/provider-registry.module';
import {
  TapdResolver,
  TapAssetGenesisResolver,
  TapAssetResolver,
} from './tapd.resolver';
import { TapFederationService } from './tapd-federation.service';

@Module({
  imports: [TapdModule, FetchModule, AccountsModule, ProviderRegistryModule],
  providers: [
    TapdResolver,
    TapAssetGenesisResolver,
    TapAssetResolver,
    TapFederationService,
  ],
})
export class TapdApiModule {}
