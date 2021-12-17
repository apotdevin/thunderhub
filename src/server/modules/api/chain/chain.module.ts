import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import { ChainResolver } from './chain.resolver';

@Module({
  imports: [NodeModule],
  providers: [ChainResolver],
})
export class ChainModule {}
