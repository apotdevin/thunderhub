import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import { NodeModule } from '../../node/node.module';
import { TradeResolver } from './trade.resolver';

@Module({
  imports: [TapdModule, NodeModule],
  providers: [TradeResolver],
})
export class TradeModule {}
