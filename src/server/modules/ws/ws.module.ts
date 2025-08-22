import { Module } from '@nestjs/common';

import { AuthenticationModule } from '../auth/auth.module';
import { WsGateway } from './ws.gateway';
import { WsService } from './ws.service';

@Module({
  imports: [AuthenticationModule],
  providers: [WsGateway, WsService],
  exports: [WsService],
})
export class WsModule {}
