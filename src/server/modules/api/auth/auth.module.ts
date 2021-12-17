import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { FilesModule } from '../../files/files.module';
import { NodeModule } from '../../node/node.module';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [AccountsModule, FilesModule, NodeModule],
  providers: [AuthResolver],
})
export class AuthModule {}
