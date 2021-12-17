import { Module } from '@nestjs/common';
import { FetchService } from './fetch.service';

@Module({
  providers: [FetchService],
  exports: [FetchService],
})
export class FetchModule {}
