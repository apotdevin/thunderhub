import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { BosResolver } from './bos.resolver';

@Module({
  imports: [AccountsModule],
  providers: [BosResolver],
})
export class BosModule {}
