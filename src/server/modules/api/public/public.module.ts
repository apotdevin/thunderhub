import { Module } from '@nestjs/common';
import { PublicResolver } from './public.resolver';

@Module({
  providers: [PublicResolver],
})
export class PublicModule {}
