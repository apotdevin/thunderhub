import { Module } from '@nestjs/common';
import { LdkServerService } from './ldk-server.service';

@Module({
  providers: [LdkServerService],
  exports: [LdkServerService],
})
export class LdkServerModule {}
