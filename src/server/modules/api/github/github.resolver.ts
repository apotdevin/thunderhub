import { Query, Resolver } from '@nestjs/graphql';
import { appUrls } from 'src/server/utils/appUrls';
import { toWithError } from 'src/server/utils/async';
import { FetchService } from '../../fetch/fetch.service';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Resolver()
export class GithubResolver {
  constructor(
    private fetchService: FetchService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => String)
  async getLatestVersion() {
    const [response, error] = await toWithError<any>(
      this.fetchService.fetchWithProxy(appUrls.github)
    );

    if (error || !response) {
      this.logger.debug('Unable to get latest github version');
      throw new Error('NoGithubVersion');
    }

    const json = await response.json();

    return json.tag_name;
  }
}
