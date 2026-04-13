import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import {
  TapdResolver,
  TapAssetGenesisResolver,
  TapAssetResolver,
} from './tapd.resolver';
import { TapFederationService } from './tapd-federation.service';

@Module({
  imports: [TapdModule],
  providers: [
    TapdResolver,
    TapAssetGenesisResolver,
    TapAssetResolver,
    TapFederationService,
  ],
})
export class TapdApiModule {}
