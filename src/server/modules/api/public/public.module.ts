import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { FilesModule } from '../../files/files.module';
import { NodeModule } from '../../node/node.module';
import { PublicResolver } from './public.resolver';

@Module({
  imports: [AccountsModule, FilesModule, NodeModule],
  providers: [PublicResolver],
})
export class PublicModule {}
