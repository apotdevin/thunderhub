import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from '../accounts/accounts.module';
import { PeerSwapService } from './peerswap.service';

@Module({
  providers: [PeerSwapService],
  imports: [ConfigModule, AccountsModule],
  exports: [PeerSwapService],
})
export class PeerSwapModule {}
