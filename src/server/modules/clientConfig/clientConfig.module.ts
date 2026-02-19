import { Module } from '@nestjs/common';
import { ClientConfigController } from './clientConfig.controller';

@Module({
  controllers: [ClientConfigController],
})
export class ClientConfigModule {}
