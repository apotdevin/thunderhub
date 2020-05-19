import { getGraphQLRateLimiter } from 'graphql-rate-limit';
import { logger } from './logger';

interface RateConfigProps {
  [key: string]: {
    max: number;
    window: string;
  };
}

export const RateConfig: RateConfigProps = {
  getMessages: { max: 10, window: '5s' },
};

const rateLimiter = getGraphQLRateLimiter({
  identifyContext: (ctx: string) => ctx,
  formatError: () => 'Rate Limit Reached',
});

export const requestLimiter = async (rate: string, field: string) => {
  const { max, window } = RateConfig[field] || { max: 5, window: '5s' };
  const errorMessage = await rateLimiter(
    {
      parent: rate,
      args: {},
      context: rate,
      info: { fieldName: field } as any,
    },
    { max, window }
  );
  if (errorMessage) {
    logger.warn(`Rate limit reached for '${field}' from ip ${rate}`);
    throw new Error(errorMessage);
  }
};
