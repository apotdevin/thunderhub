import { Module } from '@nestjs/common';
import { TapdModule } from '../../node/tapd/tapd.module';
import { TapdResolver } from './tapd.resolver';

@Module({
  imports: [TapdModule],
  providers: [TapdResolver],
})
export class TapdApiModule {}
