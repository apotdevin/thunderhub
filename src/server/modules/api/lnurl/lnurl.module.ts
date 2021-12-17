import { Module } from '@nestjs/common';
import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule } from '../../node/node.module';
import { LnUrlResolver } from './lnurl.resolver';
import { LnUrlService } from './lnurl.service';

@Module({
  imports: [NodeModule, FetchModule],
  providers: [LnUrlResolver, LnUrlService],
  exports: [LnUrlService],
})
export class LnUrlModule {}
