import { subDays } from 'date-fns';
import { to } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { ContextType } from 'server/types/apiTypes';
import { GetForwardsType } from 'server/types/ln-service.types';
import { getForwards as getLnForwards } from 'ln-service';
import { sortBy } from 'lodash';

export const forwardsResolver = {
  Query: {
    getForwards: async (
      _: undefined,
      { days }: { days: number },
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'getForwardsPastDays');

      const { lnd } = context;

      const today = new Date();
      const startDate = subDays(today, days);

      const forwardsList = await to<GetForwardsType>(
        getLnForwards({
          lnd,
          after: startDate,
          before: today,
        })
      );

      let forwards = forwardsList.forwards;
      let next = forwardsList.next;

      let finishedFetching = false;

      if (!next || !forwards || forwards.length <= 0) {
        finishedFetching = true;
      }

      while (!finishedFetching) {
        if (next) {
          const moreForwards = await to<GetForwardsType>(
            getLnForwards({ lnd, token: next })
          );
          forwards = [...forwards, ...moreForwards.forwards];
          next = moreForwards.next;
        } else {
          finishedFetching = true;
        }
      }

      return sortBy(forwards, 'created_at').reverse();
    },
  },
};
