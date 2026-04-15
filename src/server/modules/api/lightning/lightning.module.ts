import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import {
  LightningQueryRoot,
  LightningQueriesResolver,
} from './lightning.resolver';

@Module({
  imports: [NodeModule],
  providers: [LightningQueryRoot, LightningQueriesResolver],
})
export class LightningModule {}
