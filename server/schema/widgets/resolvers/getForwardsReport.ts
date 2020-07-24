import { getForwards } from 'ln-service';
import { groupBy } from 'underscore';
import {
  subHours,
  subDays,
  differenceInHours,
  differenceInCalendarDays,
} from 'date-fns';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';

import { to } from 'server/helpers/async';
import { GetForwardsType } from 'server/types/ln-service.types';
import { reduceForwardArray } from './helpers';

export const getForwardReport = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'forwardReport');

  const { lnd } = context;

  let startDate = new Date();
  const endDate = new Date();
  let days = 7;

  if (params.time === 'week') {
    startDate = subDays(endDate, 7);
  } else if (params.time === 'month') {
    startDate = subDays(endDate, 30);
    days = 30;
  } else if (params.time === 'quarter_year') {
    startDate = subDays(endDate, 90);
    days = 90;
  } else if (params.time === 'half_year') {
    startDate = subDays(endDate, 180);
    days = 180;
  } else if (params.time === 'year') {
    startDate = subDays(endDate, 360);
    days = 360;
  } else {
    startDate = subHours(endDate, 24);
  }

  const forwardsList = await to<GetForwardsType>(
    getForwards({
      lnd,
      after: startDate,
      before: endDate,
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
        getForwards({ lnd, token: next })
      );
      forwards = [...forwards, ...moreForwards.forwards];
      next = moreForwards.next;
    } else {
      finishedFetching = true;
    }
  }

  if (params.time === 'day') {
    const orderedHour = groupBy(
      forwards,
      item => 24 - differenceInHours(endDate, new Date(item.created_at))
    );

    const reducedOrderedHour = reduceForwardArray(orderedHour);

    return JSON.stringify(reducedOrderedHour);
  }

  const orderedDay = groupBy(
    forwards,
    item => days - differenceInCalendarDays(endDate, new Date(item.created_at))
  );

  const reducedOrderedDay = reduceForwardArray(orderedDay);

  return JSON.stringify(reducedOrderedDay);
};
