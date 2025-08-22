import { Module } from '@nestjs/common';

import { NodeModule } from '../../node/node.module';
import {
  AggregatedChannelForwardsResolver,
  AggregatedChannelSideForwardsResolver,
  AggregatedRouteForwardsResolver,
  AggregatedSideStatsResolver,
  BaseNodeInfoResolver,
  ChannelInfoResolver,
  ForwardResolver,
  ForwardsResolver,
  GetForwardsResolver,
} from './forwards.resolver';

@Module({
  imports: [NodeModule],
  providers: [
    ForwardsResolver,
    ChannelInfoResolver,
    BaseNodeInfoResolver,
    GetForwardsResolver,
    AggregatedChannelSideForwardsResolver,
    AggregatedRouteForwardsResolver,
    ForwardResolver,
    AggregatedChannelForwardsResolver,
    AggregatedSideStatsResolver,
  ],
})
export class ForwardsModule {}
