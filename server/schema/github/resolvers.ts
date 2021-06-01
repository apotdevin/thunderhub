import { requestLimiter } from 'server/helpers/rateLimiter';
import { ContextType } from 'server/types/apiTypes';
import { toWithError } from 'server/helpers/async';
import { appUrls } from 'server/utils/appUrls';
import { logger } from 'server/helpers/logger';
import { fetchWithProxy } from 'server/utils/fetch';

export const githubResolvers = {
  Query: {
    getLatestVersion: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'getLnPay');

      const [response, error] = await toWithError<any>(
        fetchWithProxy(appUrls.github)
      );

      if (error || !response) {
        logger.debug('Unable to get latest github version');
        throw new Error('NoGithubVersion');
      }

      const json = await response.json();

      return json.tag_name;
    },
  },
};
