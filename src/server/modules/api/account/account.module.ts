import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { AccountResolver, PublicQueriesResolver } from './account.resolver';

@Module({
  imports: [AccountsModule],
  providers: [AccountResolver, PublicQueriesResolver],
})
export class AccountModule {}
