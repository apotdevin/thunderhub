import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import { FetchModule } from '../../fetch/fetch.module';
import { TapdResolver } from './tapd.resolver';

@Module({
  imports: [TapdModule, FetchModule],
  providers: [TapdResolver],
})
export class TapdApiModule {}
