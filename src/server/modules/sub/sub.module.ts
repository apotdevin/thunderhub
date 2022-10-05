import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { AmbossModule } from '../api/amboss/amboss.module';
import { UserConfigModule } from '../api/userConfig/userConfig.module';
import { NodeModule } from '../node/node.module';
import { WsModule } from '../ws/ws.module';
import { SubService } from './sub.service';

@Module({
  imports: [
    UserConfigModule,
    NodeModule,
    AccountsModule,
    WsModule,
    AmbossModule,
  ],
  providers: [SubService],
})
export class SubModule {}
