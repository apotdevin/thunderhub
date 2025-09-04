import { Module } from '@nestjs/common';
import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule } from '../../node/node.module';
import {
  BoltzResolver,
  CreateBoltzReverseSwapTypeResolver,
} from './boltz.resolver';
import { BoltzService } from './boltz.service';
import { MempoolModule } from '../../mempool/mempool.module';

@Module({
  imports: [NodeModule, FetchModule, MempoolModule],
  providers: [BoltzService, CreateBoltzReverseSwapTypeResolver, BoltzResolver],
  exports: [BoltzService],
})
export class BoltzModule {}
