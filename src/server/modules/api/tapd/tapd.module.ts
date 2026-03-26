import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import { FetchModule } from '../../fetch/fetch.module';
import {
  TapdResolver,
  TapAssetGenesisResolver,
  TapAssetResolver,
} from './tapd.resolver';

@Module({
  imports: [TapdModule, FetchModule],
  providers: [TapdResolver, TapAssetGenesisResolver, TapAssetResolver],
})
export class TapdApiModule {}
