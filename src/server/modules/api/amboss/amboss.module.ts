import { Module } from '@nestjs/common';
import { FetchModule } from '../../fetch/fetch.module';
import { AmbossResolver } from './amboss.resolver';

@Module({ imports: [FetchModule], providers: [AmbossResolver] })
export class AmbossModule {}
