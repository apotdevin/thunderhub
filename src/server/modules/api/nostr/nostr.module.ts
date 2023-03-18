import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { NostrResolver } from './nostr.resolver';
import { NostrService } from './nostr.service';

@Module({
  imports: [AccountsModule],
  providers: [NostrResolver, NostrService],
})
export class NostrModule {}
