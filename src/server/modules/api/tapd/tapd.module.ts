import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import {
  TaprootAssetsMutationRoot,
  TaprootAssetsMutationsResolver,
  TaprootAssetsQueriesResolver,
  TaprootAssetsQueryRoot,
} from './tapd.resolver';
import { TapFederationService } from './tapd-federation.service';

@Module({
  imports: [TapdModule],
  providers: [
    TaprootAssetsQueryRoot,
    TaprootAssetsMutationRoot,
    TaprootAssetsQueriesResolver,
    TaprootAssetsMutationsResolver,
    TapFederationService,
  ],
})
export class TapdApiModule {}
