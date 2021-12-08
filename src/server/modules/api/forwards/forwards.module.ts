import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import { ForwardsResolver } from './forwards.resolver';

@Module({
  imports: [NodeModule],
  providers: [ForwardsResolver],
})
export class ForwardsModule {}
