import { Module } from '@nestjs/common';
import { NodeModule } from './node/node.module';
import { AccountModule } from './account/account.module';
import { AmbossModule } from './amboss/amboss.module';
import { AuthModule } from './auth/auth.module';
import { BaseModule } from './base/base.module';
import { BitcoinModule } from './bitcoin/bitcoin.module';
import { MainModule } from './main/main.module';
import { GithubModule } from './github/github.module';
import { WalletModule } from './wallet/wallet.module';
import { ToolsModule } from './tools/tools.module';
import { MacaroonModule } from './macaroon/macaroon.module';
import { NetworkModule } from './network/network.module';
import { PeerModule } from './peer/peer.module';
import { ChainModule } from './chain/chain.module';
import { EdgeModule } from './edge/edge.module';
import { LnUrlModule } from './lnurl/lnurl.module';
import { ChannelsModule } from './channels/channels.module';
import { ForwardsModule } from './forwards/forwards.module';
import { HealthModule } from './health/health.module';
import { TransactionsModule } from './transactions/transactions.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ChatModule } from './chat/chat.module';
import { BoltzModule } from './boltz/boltz.module';
import { LnMarketsModule } from './lnmarkets/lnmarkets.module';
import { BosModule } from './bos/bos.module';

@Module({
  imports: [
    MainModule,
    BaseModule,
    AuthModule,
    AccountModule,
    AmbossModule,
    BitcoinModule,
    NodeModule,
    GithubModule,
    WalletModule,
    ToolsModule,
    MacaroonModule,
    NetworkModule,
    PeerModule,
    ChainModule,
    EdgeModule,
    LnUrlModule,
    ChannelsModule,
    ForwardsModule,
    HealthModule,
    TransactionsModule,
    InvoicesModule,
    ChatModule,
    BoltzModule,
    LnMarketsModule,
    BosModule,
  ],
})
export class ApiModule {}
