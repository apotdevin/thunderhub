import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import { MacaroonResolver } from './macaroon.resolver';

@Module({
  imports: [NodeModule],
  providers: [MacaroonResolver],
})
export class MacaroonModule {}
