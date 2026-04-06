import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { ProviderRegistryModule } from '../../node/provider-registry.module';
import {
  AccountResolver,
  PublicQueriesResolver,
  UserQueryRoot,
  TeamMutationRoot,
  TeamMutationsResolver,
  UserQueriesResolver,
} from './account.resolver';

@Module({
  imports: [AccountsModule, ProviderRegistryModule],
  providers: [
    AccountResolver,
    PublicQueriesResolver,
    UserQueryRoot,
    TeamMutationRoot,
    TeamMutationsResolver,
    UserQueriesResolver,
  ],
})
export class AccountModule {}
