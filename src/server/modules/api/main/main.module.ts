import { Module } from '@nestjs/common';
import { MainResolver } from './main.resolver';

@Module({
  providers: [MainResolver],
})
export class MainModule {}
