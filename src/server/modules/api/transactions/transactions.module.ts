import { Module } from '@nestjs/common';

import { NodeModule } from '../../node/node.module';
import { TransactionsResolver } from './transactions.resolver';

@Module({
  imports: [NodeModule],
  providers: [TransactionsResolver],
})
export class TransactionsModule {}
