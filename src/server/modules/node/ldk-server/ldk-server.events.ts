import { events, types } from './proto/ldk-server';
import { msatToSat, toNumber } from './ldk-server.helpers';

export type LdkServerSseEvent =
  | { name: 'invoice_updated'; data: Record<string, unknown> }
  | { name: 'payment'; data: Record<string, unknown> }
  | { name: 'forward'; data: Record<string, unknown> }
  | { name: 'channel_updated'; data: Record<string, unknown> };

export function mapLdkServerEvent(
  envelope: events.IEventEnvelope
): LdkServerSseEvent | undefined {
  if (envelope.paymentReceived?.payment) {
    return {
      name: 'invoice_updated',
      data: mapPaymentToInvoiceEvent(envelope.paymentReceived.payment),
    };
  }

  if (envelope.paymentClaimable?.payment) {
    return {
      name: 'invoice_updated',
      data: mapPaymentToInvoiceEvent(envelope.paymentClaimable.payment),
    };
  }

  if (envelope.paymentSuccessful?.payment) {
    const payment = envelope.paymentSuccessful.payment;
    return payment.direction === types.PaymentDirection.OUTBOUND
      ? { name: 'payment', data: mapPaymentToPaymentEvent(payment) }
      : { name: 'invoice_updated', data: mapPaymentToInvoiceEvent(payment) };
  }

  if (envelope.paymentFailed?.payment) {
    const payment = envelope.paymentFailed.payment;
    if (payment.direction === types.PaymentDirection.OUTBOUND) {
      return { name: 'payment', data: mapPaymentToPaymentEvent(payment) };
    }
  }

  if (envelope.paymentForwarded?.forwardedPayment) {
    return {
      name: 'forward',
      data: mapForwardedPaymentToForwardEvent(
        envelope.paymentForwarded.forwardedPayment
      ),
    };
  }

  if (envelope.channelStateChanged) {
    return {
      name: 'channel_updated',
      data: {
        id: envelope.channelStateChanged.channelId || '',
        partner_public_key: envelope.channelStateChanged.counterpartyNodeId,
        transaction_id: envelope.channelStateChanged.fundingTxo,
      },
    };
  }

  return undefined;
}

function mapPaymentToInvoiceEvent(payment: types.IPayment) {
  const amountMsat = toNumber(payment.amountMsat);
  const tokens = msatToSat(amountMsat);
  const isConfirmed = payment.status === types.PaymentStatus.SUCCEEDED;

  return {
    tokens,
    is_confirmed: isConfirmed,
    description: '',
    description_hash: '',
    received: isConfirmed ? tokens : 0,
  };
}

function mapPaymentToPaymentEvent(payment: types.IPayment) {
  const amountMsat = toNumber(payment.amountMsat);
  const feeMsat = toNumber(payment.feePaidMsat);

  return {
    hops: [],
    fee: msatToSat(feeMsat),
    destination: '',
    tokens: msatToSat(amountMsat),
  };
}

function mapForwardedPaymentToForwardEvent(forward: types.IForwardedPayment) {
  const feeMsat = toNumber(forward.totalFeeEarnedMsat);
  const amountMsat = toNumber(forward.outboundAmountForwardedMsat);

  return {
    is_confirmed: true,
    is_receive: false,
    is_send: false,
    in_channel: forward.prevChannelId || '',
    out_channel: forward.nextChannelId || '',
    fee: msatToSat(feeMsat),
    tokens: msatToSat(amountMsat),
  };
}
