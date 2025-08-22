import { Module } from '@nestjs/common';

import { FetchModule } from '../../fetch/fetch.module';
import { BaseResolver } from './base.resolver';

@Module({ imports: [FetchModule], providers: [BaseResolver] })
export class BaseModule {}
