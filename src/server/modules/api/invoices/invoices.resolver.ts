import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { createHash, randomBytes } from 'crypto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { CreateInvoice, DecodeInvoice, PayInvoice } from './invoices.types';

const KEYSEND_TYPE = '5482373484';

@Resolver()
export class InvoicesResolver {
  constructor(
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => String)
  async getInvoiceStatusChange(
    @CurrentUser() user: UserId,
    @Args('id') id: string
  ) {
    const sub = this.nodeService.subscribeToInvoice(user.id, id);

    return Promise.race([
      new Promise(resolve => {
        sub.on('invoice_updated', (data: any) => {
          if (data.is_confirmed) {
            resolve(true);
          }
        });
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 90000)
      ),
    ])
      .then((res: any) => {
        if (res) {
          return 'paid';
        }
        return 'not_paid';
      })
      .catch(e => {
        if (e) return 'timeout';
      });
  }

  @Query(() => DecodeInvoice)
  async decodeRequest(
    @CurrentUser() user: UserId,
    @Args('request') request: string
  ) {
    const decoded = await this.nodeService.decodePaymentRequest(
      user.id,
      request
    );

    return {
      ...decoded,
      destination_node: { publicKey: decoded.destination },
    };
  }

  @Mutation(() => CreateInvoice)
  async createInvoice(
    @CurrentUser() user: UserId,
    @Args('amount') amount: number,
    @Args('description', { nullable: true }) description: string,
    @Args('secondsUntil', { nullable: true }) secondsUntil: number,
    @Args('includePrivate', { nullable: true }) includePrivate: boolean
  ) {
    const getDate = (secondsUntil: number) => {
      const date = new Date();
      date.setSeconds(date.getSeconds() + secondsUntil);

      return date.toISOString();
    };

    const invoiceParams = {
      tokens: amount,
      ...(description && { description }),
      ...(!!secondsUntil && { expires_at: getDate(secondsUntil) }),
      ...(includePrivate && { is_including_private_channels: true }),
    };

    this.logger.info('Creating invoice with params', invoiceParams);

    return await this.nodeService.createInvoice(user.id, invoiceParams);
  }

  @Mutation(() => PayInvoice)
  async keysend(
    @CurrentUser() user: UserId,
    @Args('tokens') tokens: number,
    @Args('destination', { nullable: true }) destination: string
  ) {
    const preimage = randomBytes(32);
    const secret = preimage.toString('hex');
    const id = createHash('sha256').update(preimage).digest().toString('hex');

    return await this.nodeService.payViaPaymentDetails(user.id, {
      id,
      tokens,
      destination,
      messages: [
        {
          type: KEYSEND_TYPE,
          value: secret,
        },
      ],
    });
  }

  @Mutation(() => Boolean)
  async pay(
    @CurrentUser() user: UserId,
    @Args('max_fee') max_fee: number,
    @Args('max_paths') max_paths: number,
    @Args('request') request: string,
    @Args('out', { nullable: true, type: () => [String] })
    outgoing_channels: string[]
  ) {
    const props = {
      max_fee,
      max_paths,
      request,
      outgoing_channels,
    };

    this.logger.debug('Paying invoice with params', props);

    const response = await this.nodeService.pay(user.id, props);

    this.logger.debug('Paid invoice', response);
    return true;
  }
}
