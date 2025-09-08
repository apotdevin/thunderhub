import { Module } from '@nestjs/common';
import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule } from '../../node/node.module';
import {
  BoltzResolver,
  CreateBoltzReverseSwapTypeResolver,
} from './boltz.resolver';
import { BoltzService } from './boltz.service';
import { MempoolModule } from '../../mempool/mempool.module';
import { BlockstreamModule } from '../../blockstream/blockstream.module';

@Module({
  imports: [NodeModule, FetchModule, MempoolModule, BlockstreamModule],
  providers: [BoltzService, CreateBoltzReverseSwapTypeResolver, BoltzResolver],
  exports: [BoltzService],
})
export class BoltzModule {}
