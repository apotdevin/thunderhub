import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import { FetchModule } from '../../fetch/fetch.module';
import { AccountsModule } from '../../accounts/accounts.module';
import { MacaroonResolver } from './macaroon.resolver';

@Module({
  imports: [NodeModule, FetchModule, AccountsModule],
  providers: [MacaroonResolver],
})
export class MacaroonModule {}
