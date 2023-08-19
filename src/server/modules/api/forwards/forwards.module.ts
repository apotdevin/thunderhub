import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import {
  BaseNodeInfoResolver,
  ChannelInfoResolver,
  ForwardResolver,
  ForwardsResolver,
} from './forwards.resolver';

@Module({
  imports: [NodeModule],
  providers: [
    ForwardsResolver,
    ForwardResolver,
    ChannelInfoResolver,
    BaseNodeInfoResolver,
  ],
})
export class ForwardsModule {}
