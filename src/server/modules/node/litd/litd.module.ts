import { Module } from '@nestjs/common';
import { LndModule } from '../lnd/lnd.module';
import { LitdService } from './litd.service';

@Module({
  imports: [LndModule],
  providers: [LitdService],
  exports: [LitdService],
})
export class LitdModule {}
