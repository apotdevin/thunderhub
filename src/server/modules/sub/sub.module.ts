import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { AmbossModule } from '../api/amboss/amboss.module';
import { UserConfigModule } from '../api/userConfig/userConfig.module';
import { NodeModule } from '../node/node.module';
import { SseModule } from '../sse/sse.module';
import { SubService } from './sub.service';

@Module({
  imports: [
    UserConfigModule,
    NodeModule,
    AccountsModule,
    SseModule,
    AmbossModule,
  ],
  providers: [SubService],
})
export class SubModule {}
