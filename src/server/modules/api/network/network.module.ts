import { Module } from '@nestjs/common';

import { NodeModule } from '../../node/node.module';
import { NetworkResolver } from './network.resolver';

@Module({
  imports: [NodeModule],
  providers: [NetworkResolver],
})
export class NetworkModule {}
