import { Module } from '@nestjs/common';
import { FetchModule } from '../../fetch/fetch.module';
import { GithubResolver } from './github.resolver';

@Module({ imports: [FetchModule], providers: [GithubResolver] })
export class GithubModule {}
