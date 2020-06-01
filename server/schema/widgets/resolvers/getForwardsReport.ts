import { getForwards as getLnForwards } from 'ln-service';
import { groupBy } from 'underscore';
import {
  subHours,
  subDays,
  differenceInHours,
  differenceInCalendarDays,
} from 'date-fns';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from 'server/helpers/helpers';
import { reduceForwardArray } from './helpers';
import { ForwardCompleteProps } from './interface';

export const getForwardReport = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'forwardReport');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  let startDate = new Date();
  const endDate = new Date();
  let days = 7;

  if (params.time === 'month') {
    startDate = subDays(endDate, 30);
    days = 30;
  } else if (params.time === 'week') {
    startDate = subDays(endDate, 7);
  } else {
    startDate = subHours(endDate, 24);
  }

  try {
    const forwardsList: ForwardCompleteProps = await getLnForwards({
      lnd,
      after: startDate,
      before: endDate,
    });

    if (params.time === 'month' || params.time === 'week') {
      const orderedDay = groupBy(forwardsList.forwards, item => {
        return (
          days - differenceInCalendarDays(endDate, new Date(item.created_at))
        );
      });

      const reducedOrderedDay = reduceForwardArray(orderedDay);

      return JSON.stringify(reducedOrderedDay);
    }
    const orderedHour = groupBy(forwardsList.forwards, item => {
      return 24 - differenceInHours(endDate, new Date(item.created_at));
    });

    const reducedOrderedHour = reduceForwardArray(orderedHour);

    return JSON.stringify(reducedOrderedHour);
  } catch (error) {
    logger.error('Error getting forward report: %o', error);
    throw new Error(getErrorMsg(error));
  }
};
