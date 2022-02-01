import { Module } from '@nestjs/common';
import { FilesModule } from '../../files/files.module';
import { UserConfigResolver } from './userConfig.resolver';
import { UserConfigService } from './userConfig.service';

@Module({
  imports: [FilesModule],
  providers: [UserConfigService, UserConfigResolver],
  exports: [UserConfigService],
})
export class UserConfigModule {}
