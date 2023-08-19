import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { AmbossModule } from '../api/amboss/amboss.module';

@Module({
  imports: [AmbossModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
