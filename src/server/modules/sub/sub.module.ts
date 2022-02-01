import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { UserConfigModule } from '../api/userConfig/userConfig.module';
import { FetchModule } from '../fetch/fetch.module';
import { NodeModule } from '../node/node.module';
import { WsModule } from '../ws/ws.module';
import { SubService } from './sub.service';

@Module({
  imports: [
    UserConfigModule,
    FetchModule,
    NodeModule,
    AccountsModule,
    WsModule,
  ],
  providers: [SubService],
})
export class SubModule {}
