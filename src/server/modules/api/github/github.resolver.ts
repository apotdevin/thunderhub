import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Query, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { toWithError } from 'src/server/utils/async';
import { Logger } from 'winston';

import { FetchService } from '../../fetch/fetch.service';

@Resolver()
export class GithubResolver {
  constructor(
    private configService: ConfigService,
    private fetchService: FetchService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => String)
  async getLatestVersion() {
    const [response, error] = await toWithError<any>(
      this.fetchService.fetchWithProxy(this.configService.get('urls.github'))
    );

    if (error || !response) {
      this.logger.debug('Unable to get latest github version');
      throw new Error('NoGithubVersion');
    }

    const json = await response.json();

    return json.tag_name;
  }
}
