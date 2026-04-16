import { Module } from '@nestjs/common';
import { NodeModule as NodeServiceModule } from '../../node/node.module';
import {
  BalancesResolver,
  CurrentNodeResolver,
  LightningBalanceResolver,
  NodeFieldResolver,
  NodeInfoResolver,
  NodeResolver,
  OnChainBalanceResolver,
} from './node.resolver';
import { FetchModule } from '../../fetch/fetch.module';
import { AccountsModule } from '../../accounts/accounts.module';

@Module({
  imports: [NodeServiceModule, FetchModule, AccountsModule],
  providers: [
    NodeResolver,
    BalancesResolver,
    OnChainBalanceResolver,
    LightningBalanceResolver,
    NodeFieldResolver,
    NodeInfoResolver,
    CurrentNodeResolver,
  ],
})
export class NodeModule {}
