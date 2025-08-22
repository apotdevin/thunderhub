import { Module } from '@nestjs/common';

import { NodeModule } from '../../node/node.module';
import { EdgeResolver } from './edge.resolver';

@Module({
  imports: [NodeModule],
  providers: [EdgeResolver],
})
export class EdgeModule {}
