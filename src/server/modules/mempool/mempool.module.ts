import { Module } from '@nestjs/common';
import { MempoolService } from './mempool.service';
import { FetchModule } from '../fetch/fetch.module';

@Module({
  imports: [FetchModule],
  providers: [MempoolService],
  exports: [MempoolService],
})
export class MempoolModule {}
