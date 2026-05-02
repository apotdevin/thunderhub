import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { AmbossModule } from '../api/amboss/amboss.module';
import { ChannelMetadataService } from '../api/channels/channel-metadata.service';

@Module({
  imports: [AmbossModule],
  providers: [DataloaderService, ChannelMetadataService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
