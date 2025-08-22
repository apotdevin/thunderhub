import { Module } from '@nestjs/common';

import { AccountsModule } from '../../accounts/accounts.module';
import { WsModule } from '../../ws/ws.module';
import { BosResolver } from './bos.resolver';

@Module({
  imports: [WsModule, AccountsModule],
  providers: [BosResolver],
})
export class BosModule {}
