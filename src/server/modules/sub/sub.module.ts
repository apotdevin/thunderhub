import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { WsModule } from '../ws/ws.module';
import { SubService } from './sub.service';

@Module({
  imports: [AccountsModule, WsModule],
  providers: [SubService],
})
export class SubModule {}
