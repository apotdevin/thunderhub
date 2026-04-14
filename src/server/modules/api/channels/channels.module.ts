import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelsResolver } from './channels.resolver';
import { FetchModule } from '../../fetch/fetch.module';
import { AmbossModule } from '../amboss/amboss.module';

@Module({
  imports: [NodeModule, FetchModule, AmbossModule],
  providers: [ChannelsResolver, ChannelResolver],
})
export class ChannelsModule {}
