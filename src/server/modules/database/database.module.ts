import { Global, Module } from '@nestjs/common';
import { drizzleProvider, DRIZZLE } from './drizzle.provider';

@Global()
@Module({
  providers: [drizzleProvider],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
