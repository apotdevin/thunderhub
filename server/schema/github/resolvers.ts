import { requestLimiter } from 'server/helpers/rateLimiter';
import { ContextType } from 'server/types/apiTypes';
import { toWithError } from 'server/helpers/async';
import { appUrls } from 'server/utils/appUrls';
import { logger } from 'server/helpers/logger';

export const githubResolvers = {
  Query: {
    getLatestVersion: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'getLnPay');

      const [response, error] = await toWithError(fetch(appUrls.github));

      if (error || !response) {
        logger.debug('Unable to get latest github version');
        throw new Error('NoGithubVersion');
      }

      const json = await response.json();

      return json.tag_name;
    },
  },
};
