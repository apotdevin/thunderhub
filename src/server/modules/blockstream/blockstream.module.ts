import { Module } from '@nestjs/common';
import { BlockstreamService } from './blockstream.service';
import { FetchModule } from '../fetch/fetch.module';

@Module({
  imports: [FetchModule],
  providers: [BlockstreamService],
  exports: [BlockstreamService],
})
export class BlockstreamModule {}
