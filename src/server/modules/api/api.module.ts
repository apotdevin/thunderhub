import { Module } from '@nestjs/common';

import { AccountModule } from './account/account.module';
import { AmbossModule } from './amboss/amboss.module';
import { AuthModule } from './auth/auth.module';
import { BaseModule } from './base/base.module';
import { BitcoinModule } from './bitcoin/bitcoin.module';
import { BoltzModule } from './boltz/boltz.module';
import { BosModule } from './bos/bos.module';
import { ChainModule } from './chain/chain.module';
import { ChannelsModule } from './channels/channels.module';
import { ChatModule } from './chat/chat.module';
import { EdgeModule } from './edge/edge.module';
import { ForwardsModule } from './forwards/forwards.module';
import { GithubModule } from './github/github.module';
import { HealthModule } from './health/health.module';
import { InvoicesModule } from './invoices/invoices.module';
import { LnMarketsModule } from './lnmarkets/lnmarkets.module';
import { LnUrlModule } from './lnurl/lnurl.module';
import { MacaroonModule } from './macaroon/macaroon.module';
import { MainModule } from './main/main.module';
import { NetworkModule } from './network/network.module';
import { NodeModule } from './node/node.module';
import { PeerModule } from './peer/peer.module';
import { ToolsModule } from './tools/tools.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserConfigModule } from './userConfig/userConfig.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    UserConfigModule,
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
