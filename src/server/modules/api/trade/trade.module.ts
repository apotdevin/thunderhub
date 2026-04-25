import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import { NodeModule } from '../../node/node.module';
import {
  TradeResolver,
  TradeQueryRoot,
  TradeQueriesResolver,
} from './trade.resolver';

@Module({
  imports: [TapdModule, NodeModule],
  providers: [TradeResolver, TradeQueryRoot, TradeQueriesResolver],
})
export class TradeModule {}
