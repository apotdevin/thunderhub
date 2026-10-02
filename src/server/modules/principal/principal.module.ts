import { Global, Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { PrincipalService } from './principal.service';

@Global()
@Module({
  imports: [AccountsModule],
  providers: [PrincipalService],
  exports: [PrincipalService],
})
export class PrincipalModule {}
