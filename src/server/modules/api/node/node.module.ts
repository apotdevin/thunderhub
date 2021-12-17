import { Module } from '@nestjs/common';
import { NodeModule as NodeServiceModule } from '../../node/node.module';
import {
  BalancesResolver,
  LightningBalanceResolver,
  NodeFieldResolver,
  NodeResolver,
  OnChainBalanceResolver,
} from './node.resolver';

@Module({
  imports: [NodeServiceModule],
  providers: [
    NodeResolver,
    BalancesResolver,
    OnChainBalanceResolver,
    LightningBalanceResolver,
    NodeFieldResolver,
  ],
})
export class NodeModule {}
