import { compareDesc } from 'date-fns';
import { getChannel, getNode, getPayments, getInvoices } from 'ln-service';
import { to, toWithError } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import {
  ChannelType,
  GetChannelType,
  GetInvoicesType,
  GetNodeType,
  GetPaymentsType,
  LndObject,
  PaymentType,
  InvoiceType,
} from 'server/types/ln-service.types';

export const getNodeFromChannel = async (
  lnd: {},
  channelId: string,
  public_key: string,
  closedChannels: ChannelType[]
) => {
  const closedChannel = closedChannels.find(c => c.id === channelId);

  if (closedChannel) {
    const [nodeInfo, nodeError] = await toWithError<GetNodeType>(
      getNode({
        lnd,
        is_omitting_channels: true,
        public_key: closedChannel.partner_public_key,
      })
    );

    if (nodeError || !nodeInfo) {
      logger.error(
        `Unable to get node with public key: ${closedChannel.partner_public_key}. Error %o`,
        nodeError
      );
      return null;
    }

    return {
      ...nodeInfo,
      public_key: closedChannel.partner_public_key,
      channel_id: channelId,
    };
  }

  const [info, error] = await toWithError<GetChannelType>(
    getChannel({
      lnd,
      id: channelId,
    })
  );

  if (error || !info) {
    logger.error(
      `Unable to get channel with id: ${channelId}. Error %o`,
      error
    );
    return null;
  }

  const partner_node_policy = info.policies.find(
    policy => policy.public_key !== public_key
  );

  if (!partner_node_policy?.public_key) {
    logger.error(`Unable to get partner public key for channel: ${channelId}`);
    return null;
  }

  const [nodeInfo, nodeError] = await toWithError<GetNodeType>(
    getNode({
      lnd,
      is_omitting_channels: true,
      public_key: partner_node_policy?.public_key,
    })
  );

  if (nodeError || !nodeInfo) {
    logger.error(
      `Unable to get node with public key: ${partner_node_policy?.public_key}. Error %o`,
      nodeError
    );
    return null;
  }

  return {
    ...nodeInfo,
    public_key: partner_node_policy?.public_key,
    channel_id: channelId,
  };
};

export const getPaymentsBetweenDates = async ({
  lnd,
  from,
  until,
  batch = 25,
}: {
  lnd: LndObject | null;
  from?: string;
  until?: string;
  batch?: number;
}) => {
  const paymentList = await to<GetPaymentsType>(
    getPayments({
      lnd,
      limit: batch,
    })
  );

  if (!paymentList?.payments?.length) {
    return [];
  }

  if (!from || !until) {
    return paymentList.payments;
  }

  const firstPayment = paymentList.payments[0];

  const isOutOf =
    compareDesc(new Date(firstPayment.created_at), new Date(until)) === 1;

  const filterArray = (payment: GetPaymentsType['payments'][0]) => {
    const date = payment.created_at;
    const last = compareDesc(new Date(until), new Date(date)) === 1;
    const first = compareDesc(new Date(date), new Date(from)) === 1;

    return last && first;
  };

  if (isOutOf) {
    return paymentList.payments.filter(filterArray);
  }

  let completePayments = [] as PaymentType[];
  let nextToken = paymentList.next;

  let finished = false;

  while (!finished) {
    const newPayments = await to<GetPaymentsType>(
      getPayments({
        lnd,
        token: nextToken,
      })
    );

    if (!newPayments?.payments?.length) {
      finished = true;
      break;
    }

    completePayments = [...completePayments, ...newPayments.payments];

    const firstPayment = newPayments.payments[0];

    if (compareDesc(new Date(firstPayment.created_at), new Date(until)) === 1) {
      finished = true;
      break;
    }

    if (!newPayments.next) {
      finished = true;
      break;
    }

    nextToken = newPayments.next;
  }

  return completePayments.filter(filterArray);
};

export const getInvoicesBetweenDates = async ({
  lnd,
  from,
  until,
  batch = 25,
}: {
  lnd: LndObject | null;
  from?: string;
  until?: string;
  batch?: number;
}) => {
  const invoiceList = await to<GetInvoicesType>(
    getInvoices({
      lnd,
      limit: batch,
    })
  );

  if (!invoiceList?.invoices?.length) {
    return [];
  }

  if (!from || !until) {
    return invoiceList.invoices;
  }

  const firstInvoice = invoiceList.invoices[0];
  const firstDate = firstInvoice.confirmed_at || firstInvoice.created_at;

  const isOutOf = compareDesc(new Date(firstDate), new Date(until)) === 1;

  const filterArray = (invoice: GetInvoicesType['invoices'][0]) => {
    const date = invoice.confirmed_at || invoice.created_at;
    const last = compareDesc(new Date(until), new Date(date)) === 1;
    const first = compareDesc(new Date(date), new Date(from)) === 1;

    return last && first;
  };

  if (isOutOf) {
    return invoiceList.invoices.filter(filterArray);
  }

  let completeInvoices = [] as InvoiceType[];
  let nextToken = invoiceList.next;

  let finished = false;

  while (!finished) {
    const newInvoices = await to<GetInvoicesType>(
      getInvoices({
        lnd,
        token: nextToken,
      })
    );

    if (!newInvoices?.invoices?.length) {
      finished = true;
      break;
    }

    completeInvoices = [...completeInvoices, ...newInvoices.invoices];

    const firstNewInvoice = newInvoices.invoices[0];
    const firstNewDate =
      firstNewInvoice.confirmed_at || firstNewInvoice.created_at;

    if (compareDesc(new Date(firstNewDate), new Date(until)) === 1) {
      finished = true;
      break;
    }

    if (!newInvoices.next) {
      finished = true;
      break;
    }

    nextToken = newInvoices.next;
  }

  return completeInvoices.filter(filterArray);
};
