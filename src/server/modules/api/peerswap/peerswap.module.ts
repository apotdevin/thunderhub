import { Module } from '@nestjs/common';
import { PeerSwapModule as PSModule } from '../../peerswap/peerswap.module';
import { PeerSwapResolver } from './peerswap.resolver';

@Module({
  imports: [PSModule],
  providers: [PeerSwapResolver],
})
export class PeerSwapModule {}
