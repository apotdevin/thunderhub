import { Module } from '@nestjs/common';
import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule as NodeServiceModule } from '../../node/node.module';
import {
  BalancesResolver,
  LightningBalanceResolver,
  NodeFieldResolver,
  NodeResolver,
  OnChainBalanceResolver,
} from './node.resolver';

@Module({
  imports: [FetchModule, NodeServiceModule],
  providers: [
    NodeResolver,
    BalancesResolver,
    OnChainBalanceResolver,
    LightningBalanceResolver,
    NodeFieldResolver,
  ],
})
export class NodeModule {}
