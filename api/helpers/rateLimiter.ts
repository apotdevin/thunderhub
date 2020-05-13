import { getGraphQLRateLimiter } from 'graphql-rate-limit';

interface RateConfigProps {
  [key: string]: {
    max: number;
    window: string;
  };
}

export const RateConfig: RateConfigProps = {};

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
  if (errorMessage) throw new Error(errorMessage);
};
