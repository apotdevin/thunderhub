import { Module } from '@nestjs/common';
import { FetchModule } from '../../fetch/fetch.module';
import { BitcoinResolver } from './bitcoin.resolver';

@Module({ imports: [FetchModule], providers: [BitcoinResolver] })
export class BitcoinModule {}
