import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule } from '../../node/node.module';
import { UserConfigModule } from '../userConfig/userConfig.module';
import { AmbossResolver } from './amboss.resolver';
import { AmbossService } from './amboss.service';

@Module({
  imports: [UserConfigModule, AccountsModule, NodeModule, FetchModule],
  providers: [AmbossResolver, AmbossService],
  exports: [AmbossService],
})
export class AmbossModule {}
