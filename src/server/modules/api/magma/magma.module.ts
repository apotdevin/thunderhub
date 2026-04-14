import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule } from '../../node/node.module';
import { MagmaResolver } from './magma.resolver';
import { TapFederationService } from '../tapd/tapd-federation.service';

@Module({
  imports: [TapdModule, FetchModule, NodeModule],
  providers: [MagmaResolver, TapFederationService],
})
export class MagmaModule {}
