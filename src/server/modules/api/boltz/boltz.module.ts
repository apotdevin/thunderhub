import { Module } from '@nestjs/common';
import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule } from '../../node/node.module';
import {
  BoltzResolver,
  BoltzSwapResolver,
  CreateBoltzReverseSwapTypeResolver,
} from './boltz.resolver';
import { BoltzService } from './boltz.service';

@Module({
  imports: [NodeModule, FetchModule],
  providers: [
    BoltzService,
    BoltzSwapResolver,
    CreateBoltzReverseSwapTypeResolver,
    BoltzResolver,
  ],
  exports: [BoltzService],
})
export class BoltzModule {}
