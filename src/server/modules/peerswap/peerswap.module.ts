import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PeerSwapService } from './peerswap.service';

@Module({
  providers: [PeerSwapService],
  imports: [ConfigModule],
  exports: [PeerSwapService],
})
export class PeerSwapModule {}
