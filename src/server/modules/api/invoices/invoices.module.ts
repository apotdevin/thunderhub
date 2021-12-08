import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import { InvoicesResolver } from './invoices.resolver';

@Module({
  imports: [NodeModule],
  providers: [InvoicesResolver],
})
export class InvoicesModule {}
