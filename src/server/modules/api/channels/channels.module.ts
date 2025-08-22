import { Module } from '@nestjs/common';

import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule } from '../../node/node.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelsResolver } from './channels.resolver';

@Module({
  imports: [NodeModule, FetchModule],
  providers: [ChannelsResolver, ChannelResolver],
})
export class ChannelsModule {}
