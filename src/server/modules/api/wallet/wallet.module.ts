import { Module } from '@nestjs/common';

import { NodeModule } from '../../node/node.module';
import { WalletResolver } from './wallet.resolver';

@Module({ imports: [NodeModule], providers: [WalletResolver] })
export class WalletModule {}
