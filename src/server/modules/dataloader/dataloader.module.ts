import { Module } from '@nestjs/common';

import { AmbossModule } from '../api/amboss/amboss.module';
import { DataloaderService } from './dataloader.service';

@Module({
  imports: [AmbossModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
