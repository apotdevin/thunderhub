import { Module } from '@nestjs/common';
import { FetchModule } from '../../fetch/fetch.module';
import { NodeModule } from '../../node/node.module';
import { AmbossResolver } from './amboss.resolver';

@Module({ imports: [NodeModule, FetchModule], providers: [AmbossResolver] })
export class AmbossModule {}
