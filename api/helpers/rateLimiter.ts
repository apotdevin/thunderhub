import { getGraphQLRateLimiter } from 'graphql-rate-limit';
import { RateConfig } from '../utils/rateLimitConfig';

const rateLimiter = getGraphQLRateLimiter({
  identifyContext: (ctx: string) => ctx,
  formatError: () => 'Rate Limit Reached',
});

export const requestLimiter = async (rate: string, field: string) => {
  if (!RateConfig[field]) throw new Error('Invalid Rate Field');
  const { max, window } = RateConfig[field];
  const errorMessage = await rateLimiter(
    {
      parent: rate,
      args: {},
      context: rate,
      info: { fieldName: field } as any,
    },
    { max, window }
  );
  if (errorMessage) throw new Error(errorMessage);
};
