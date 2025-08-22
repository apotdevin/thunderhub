import { Module } from '@nestjs/common';

import { FilesModule } from '../files/files.module';
import { AccountsService } from './accounts.service';

@Module({
  imports: [FilesModule],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
