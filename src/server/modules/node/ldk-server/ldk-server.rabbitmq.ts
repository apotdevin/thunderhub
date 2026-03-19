import amqplib from 'amqplib';
import { Logger } from 'winston';
import { SseService } from '../../sse/sse.service';
import { events, types } from './proto/ldk-server';
import { toNumber, msatToSat } from './ldk-server.helpers';

export type LdkServerRabbitMqConfig = {
  rabbitmqUrl: string;
  exchangeName: string;
  accountId: string;
  sseService: SseService;
  logger: Logger;
};

export class LdkServerRabbitMqConsumer {
  private config: LdkServerRabbitMqConfig;
  private connection: amqplib.ChannelModel | null = null;
  private channel: amqplib.Channel | null = null;

  constructor(config: LdkServerRabbitMqConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    const { rabbitmqUrl, exchangeName, logger } = this.config;

    this.connection = await amqplib.connect(rabbitmqUrl);
    this.channel = await this.connection.createChannel();

    // Assert the fanout exchange (must match ldk-server's config)
    await this.channel.assertExchange(exchangeName, 'fanout', {
      durable: true,
    });

    // Create an exclusive, auto-delete queue for this consumer
    const { queue } = await this.channel.assertQueue('', {
      exclusive: true,
      autoDelete: true,
    });

    await this.channel.bindQueue(queue, exchangeName, '');

    logger.info(
      `ldk-server RabbitMQ: bound to exchange "${exchangeName}", queue "${queue}"`
    );

    this.channel.consume(queue, msg => {
      if (!msg) return;

      try {
        this.handleMessage(msg.content);
      } catch (err) {
        logger.error('ldk-server RabbitMQ: error handling message', { err });
      }

      this.channel?.ack(msg);
    });

    // Reconnect on connection close
    this.connection.on('close', () => {
      logger.warn('ldk-server RabbitMQ: connection closed, reconnecting...');
      setTimeout(() => this.start().catch(() => {}), 5000);
    });

    this.connection.on('error', err => {
      logger.error('ldk-server RabbitMQ: connection error', { err });
    });
  }

  async stop(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    this.channel = null;
    this.connection = null;
  }

  private handleMessage(data: Buffer): void {
    const envelope = events.EventEnvelope.decode(new Uint8Array(data));
    const { accountId, sseService, logger } = this.config;

    if (envelope.paymentReceived) {
      const payment = envelope.paymentReceived.payment;
      if (!payment) return;

      logger.info('ldk-server event: PaymentReceived');
      sseService.emit(
        accountId,
        'invoice_updated',
        mapPaymentToInvoiceEvent(payment)
      );
    } else if (envelope.paymentSuccessful) {
      const payment = envelope.paymentSuccessful.payment;
      if (!payment) return;

      logger.info('ldk-server event: PaymentSuccessful');
      if (payment.direction === types.PaymentDirection.OUTBOUND) {
        sseService.emit(
          accountId,
          'payment',
          mapPaymentToPaymentEvent(payment)
        );
      } else {
        // Inbound successful payment = invoice paid
        sseService.emit(
          accountId,
          'invoice_updated',
          mapPaymentToInvoiceEvent(payment)
        );
      }
    } else if (envelope.paymentFailed) {
      const payment = envelope.paymentFailed.payment;
      if (!payment) return;

      logger.info('ldk-server event: PaymentFailed');
      // Emit as payment event so frontend can refetch
      if (payment.direction === types.PaymentDirection.OUTBOUND) {
        sseService.emit(
          accountId,
          'payment',
          mapPaymentToPaymentEvent(payment)
        );
      }
    } else if (envelope.paymentForwarded) {
      const forward = envelope.paymentForwarded.forwardedPayment;
      if (!forward) return;

      logger.info('ldk-server event: PaymentForwarded');
      sseService.emit(
        accountId,
        'forward',
        mapForwardedPaymentToForwardEvent(forward)
      );
    }
  }
}

export function createLdkServerRabbitMqConsumer(
  config: LdkServerRabbitMqConfig
): LdkServerRabbitMqConsumer {
  return new LdkServerRabbitMqConsumer(config);
}

// ── Event mapping helpers ──
// These map ldk-server protobuf types to the shapes the ThunderHub frontend expects.

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
