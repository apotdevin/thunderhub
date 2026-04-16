import { Module } from '@nestjs/common';
import { NodeModule } from './node/node.module';
import { AccountModule } from './account/account.module';
import { AmbossModule } from './amboss/amboss.module';
import { AuthModule } from './auth/auth.module';
import { BitcoinModule } from './bitcoin/bitcoin.module';
import { MainModule } from './main/main.module';
import { GithubModule } from './github/github.module';
import { WalletModule } from './wallet/wallet.module';
import { ToolsModule } from './tools/tools.module';
import { LightningModule } from './lightning/lightning.module';
import { MacaroonModule } from './macaroon/macaroon.module';
import { NetworkModule } from './network/network.module';
import { PeerModule } from './peer/peer.module';
import { ChainModule } from './chain/chain.module';
import { EdgeModule } from './edge/edge.module';
import { LnUrlModule } from './lnurl/lnurl.module';
import { ChannelsModule } from './channels/channels.module';
import { ForwardsModule } from './forwards/forwards.module';
import { TransactionsModule } from './transactions/transactions.module';
import { InvoicesModule } from './invoices/invoices.module';
import { BoltzModule } from './boltz/boltz.module';
import { UserConfigModule } from './userConfig/userConfig.module';
import { TapdApiModule } from './tapd/tapd.module';
import { MagmaModule } from './magma/magma.module';
import { TradeModule } from './trade/trade.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [
    UserConfigModule,
    MainModule,
    AuthModule,
    AccountModule,
    AmbossModule,
    BitcoinModule,
    NodeModule,
    GithubModule,
    WalletModule,
    ToolsModule,
    LightningModule,
    MacaroonModule,
    NetworkModule,
    PeerModule,
    ChainModule,
    EdgeModule,
    LnUrlModule,
    ChannelsModule,
    ForwardsModule,
    TransactionsModule,
    InvoicesModule,
    BoltzModule,
    TapdApiModule,
    MagmaModule,
    TradeModule,
    PublicModule,
  ],
})
export class ApiModule {}
