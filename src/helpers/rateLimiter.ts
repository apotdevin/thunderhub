import { getGraphQLRateLimiter } from "graphql-rate-limit";

const rateLimiter = getGraphQLRateLimiter({
  identifyContext: (ctx: string) => ctx,
  formatError: () => "rateLimitReached"
});

export const requestLimiter = async (
  root: string,
  params: any,
  field: string,
  max: number,
  window: string
) => {
  const errorMessage = await rateLimiter(
    {
      parent: root,
      args: params,
      context: root,
      info: { fieldName: field } as any
    },
    { max, window }
  );
  if (errorMessage) throw new Error(errorMessage);
};
