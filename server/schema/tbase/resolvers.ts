import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { toWithError } from 'server/helpers/async';
import { appUrls } from 'server/utils/appUrls';

export const tbaseResolvers = {
  Query: {
    getBaseNodes: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getBaseNodes');

      const query = '{getNodes {_id, name, public_key, socket}}';

      const [response, fetchError] = await toWithError(
        fetch(appUrls.tbase, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        })
      );
      if (fetchError || !response) return [];
      const result = await response.json();
      const { errors, data } = result || {};
      if (errors) return [];

      return (
        data?.getNodes?.filter(
          (n: { public_key: string; socket: string }) =>
            n.public_key && n.socket
        ) || []
      );
    },
  },
};
