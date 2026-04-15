import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import { FetchModule } from '../../fetch/fetch.module';
import { MacaroonResolver } from './macaroon.resolver';

@Module({
  imports: [NodeModule, FetchModule],
  providers: [MacaroonResolver],
})
export class MacaroonModule {}
