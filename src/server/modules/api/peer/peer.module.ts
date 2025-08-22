import { Module } from '@nestjs/common';

import { NodeModule } from '../../node/node.module';
import { PeerResolver } from './peer.resolver';

@Module({
  imports: [NodeModule],
  providers: [PeerResolver],
})
export class PeerModule {}
