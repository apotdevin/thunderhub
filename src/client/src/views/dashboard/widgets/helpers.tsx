import {
  differenceInDays,
  differenceInHours,
  subDays,
  subHours,
} from 'date-fns';
import { groupBy } from 'lodash';
import { GetForwardsQuery } from '../../../graphql/queries/__generated__/getForwards.generated';
import { defaultGrid } from '../../../utils/gridConstants';
import { StoredWidget } from '..';
import { widgetList, WidgetProps } from './widgetList';
import { GetInvoicesQuery } from '../../../graphql/queries/__generated__/getInvoices.generated';
import { GetPaymentsQuery } from '../../../graphql/queries/__generated__/getPayments.generated';

const ONE_WEEK = 7;

const getColumns = (width: number): number => {
  const { lg, md, sm, xs } = defaultGrid.breakpoints;

  if (width >= lg) {
    return defaultGrid.columns.lg;
  }
  if (width >= md) {
    return defaultGrid.columns.md;
  }
  if (width >= sm) {
    return defaultGrid.columns.sm;
  }
  if (width >= xs) {
    return defaultGrid.columns.xs;
  }
  return defaultGrid.columns.xxs;
};

export type EnrichedWidgetProps = {
  nodeId?: string;
  nodeAlias?: string;
  color?: string;
} & WidgetProps;

export const getWidgets = (
  widgets: StoredWidget[],
  width: number,
  extra: StoredWidget[]
): EnrichedWidgetProps[] => {
  if (!widgets?.length) return [];

  const columns = getColumns(width);

  const normalized = [...widgets, ...extra].reduce((p, c, index) => {
    const current = widgetList.find(w => w.id === c.id);

    if (!current) {
      return p;
    }

    return [
      ...p,
      {
        ...current,
        default: {
          ...current.default,
          x: (current.default.w * index) % columns,
        },
      },
    ];
  }, [] as EnrichedWidgetProps[]);

  return normalized;
};

type ArrayType =
  | GetForwardsQuery['getForwards']['list']
  | GetInvoicesQuery['getInvoices']['invoices']
  | GetPaymentsQuery['getPayments']['payments'];

export const getByTime = (array: ArrayType, time: number): any[] => {
  if (!array?.length) return [];

  const transactions: {
    difference: number;
    date: string;
    tokens: number;
    fee?: number;
  }[] = [];

  // check to see if we're working in days (isDay = false) or hours (isDay = true)
  const isDay = time <= 1;

  const today = isDay
    ? new Date().setMinutes(0, 0, 0)
    : new Date().setHours(0, 0, 0, 0);

  // Look through each transaction in the array and build an array of transactions with the difference between today and the day (or hour) that the tx occurred
  array.forEach((transaction: ArrayType[0]) => {
    if (!transaction?.__typename) return;

    if (transaction.__typename === 'InvoiceType') {
      if (!transaction.is_confirmed || !transaction.confirmed_at) return;

      const difference = isDay
        ? differenceInHours(
            today,
            new Date(transaction.confirmed_at).setMinutes(0, 0, 0)
          )
        : differenceInDays(
            today,
            new Date(transaction.confirmed_at).setHours(0, 0, 0, 0)
          );

      transactions.push({
        difference,
        date: new Date(transaction.confirmed_at).toISOString(),
        tokens: Number(transaction.tokens),
      });
    } else if (transaction.__typename === 'PaymentType') {
      if (!transaction.is_confirmed) return;

      const difference = isDay
        ? differenceInHours(
            today,
            new Date(transaction.created_at).setMinutes(0, 0, 0)
          )
        : differenceInDays(
            today,
            new Date(transaction.created_at).setHours(0, 0, 0, 0)
          );

      transactions.push({
        difference,
        date: new Date(transaction.created_at).toISOString(),
        tokens: Number(transaction.tokens),
      });
    } else if (transaction.__typename === 'Forward') {
      const difference = isDay
        ? differenceInHours(
            today,
            new Date(transaction.created_at).setMinutes(0, 0, 0)
          )
        : differenceInDays(
            today,
            new Date(transaction.created_at).setHours(0, 0, 0, 0)
          );

      transactions.push({
        difference,
        date: new Date(transaction.created_at).toISOString(),
        tokens: Number(transaction.tokens),
        fee: Number(transaction.fee),
      });
    }
  });

  if (!transactions?.length) return [];

  // Group the transactionw in the array according to the 'difference' property of the object
  const grouped = groupBy(transactions, 'difference');

  const final: any[] = [];

  // If were working with a single day, divide the array in 24 pieces, one for each hour, otherwise, go back 7 days
  const differences = Array.from(
    { length: isDay ? 24 : time ? time : ONE_WEEK },
    (_, i) => i
  );

  differences.forEach(key => {
    const group = grouped[key];
    if (!group) {
      final.push({
        tokens: 0,
        count: 0,
        fee: 0,
        date: isDay
          ? subHours(today, Number(key)).toISOString()
          : subDays(today, Number(key)).toISOString(),
      });
      return;
    }

    const reduced = group.reduce(
      (total, transaction) => {
        return {
          tokens: total.tokens + transaction.tokens,
          fee: total.fee + (transaction.fee || 0),
          count: total.count + 1,
          date: total.date
            ? total.date
            : isDay
              ? subHours(today, Number(key)).toISOString()
              : subDays(today, Number(key)).toISOString(),
        };
      },
      {
        tokens: 0,
        fee: 0,
        count: 0,
        date: '',
      }
    );

    final.push(reduced);
  });

  return final.reverse();
};
