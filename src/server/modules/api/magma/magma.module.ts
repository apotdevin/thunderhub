import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule } from '../../node/node.module';
import { MagmaResolver } from './magma.resolver';
import { TapFederationService } from '../tapd/tapd-federation.service';
import { AmbossModule } from '../amboss/amboss.module';

@Module({
  imports: [TapdModule, FetchModule, NodeModule, AmbossModule],
  providers: [MagmaResolver, TapFederationService],
})
export class MagmaModule {}
