import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelsResolver } from './channels.resolver';
import { FetchModule } from '../../fetch/fetch.module';
import { AmbossModule } from '../amboss/amboss.module';
import { TapdModule } from '../../node/tapd/tapd.module';

@Module({
  imports: [NodeModule, FetchModule, AmbossModule, TapdModule],
  providers: [ChannelsResolver, ChannelResolver],
})
export class ChannelsModule {}
