import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule } from '../../node/node.module';
import { AmbossModule } from '../amboss/amboss.module';
import {
  TapdResolver,
  TapAssetGenesisResolver,
  TapAssetResolver,
} from './tapd.resolver';

@Module({
  imports: [TapdModule, FetchModule, NodeModule, AmbossModule],
  providers: [TapdResolver, TapAssetGenesisResolver, TapAssetResolver],
})
export class TapdApiModule {}
