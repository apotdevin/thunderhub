import { Module } from '@nestjs/common';
import { NodeModule as NodeServiceModule } from '../../node/node.module';
import {
  BalancesResolver,
  LightningBalanceResolver,
  NodeFieldResolver,
  NodeInfoResolver,
  NodeResolver,
  OnChainBalanceResolver,
} from './node.resolver';
import { FetchModule } from '../../fetch/fetch.module';

@Module({
  imports: [NodeServiceModule, FetchModule],
  providers: [
    NodeResolver,
    BalancesResolver,
    OnChainBalanceResolver,
    LightningBalanceResolver,
    NodeFieldResolver,
    NodeInfoResolver,
  ],
})
export class NodeModule {}
