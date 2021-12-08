import { Module } from '@nestjs/common';
import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule } from '../../node/node.module';
import { LnMarketsResolver } from './lnmarkets.resolver';
import { LnMarketsService } from './lnmarkets.service';

@Module({
  imports: [NodeModule, FetchModule],
  providers: [LnMarketsService, LnMarketsResolver],
})
export class LnMarketsModule {}
