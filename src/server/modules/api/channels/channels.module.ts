import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import { ChannelResolver, ChannelsResolver } from './channels.resolver';

@Module({
  imports: [NodeModule],
  providers: [ChannelsResolver, ChannelResolver],
})
export class ChannelsModule {}
