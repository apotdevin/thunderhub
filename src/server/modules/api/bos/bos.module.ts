import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { SseModule } from '../../sse/sse.module';
import { BosResolver } from './bos.resolver';

@Module({
  imports: [SseModule, AccountsModule],
  providers: [BosResolver],
})
export class BosModule {}
