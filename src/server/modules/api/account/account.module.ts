import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { AccountResolver } from './account.resolver';

@Module({ imports: [AccountsModule], providers: [AccountResolver] })
export class AccountModule {}
