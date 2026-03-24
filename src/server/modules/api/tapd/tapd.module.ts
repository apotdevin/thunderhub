import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import {
  TapdResolver,
  TapAssetGenesisResolver,
  TapAssetResolver,
} from './tapd.resolver';

@Module({
  imports: [TapdModule],
  providers: [TapdResolver, TapAssetGenesisResolver, TapAssetResolver],
})
export class TapdApiModule {}
