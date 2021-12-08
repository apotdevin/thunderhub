import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { toWithError } from 'src/server/utils/async';
import {
  createCustomRecords,
  decodeMessage,
} from 'src/server/utils/customRecords';
import { Logger } from 'winston';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { randomBytes, createHash } from 'crypto';
import { GetMessages } from './chat.types';

@Resolver()
export class ChatResolver {
  constructor(
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => GetMessages)
  async getMessages(
    @CurrentUser() user: UserId,
    @Args('initialize', { nullable: true }) initialize: boolean
  ) {
    const invoiceList = await this.nodeService.getInvoices(user.id, {
      limit: initialize ? 100 : 5,
    });

    const getFiltered = () =>
      Promise.all(
        invoiceList.invoices.map(async invoice => {
          if (!invoice.is_confirmed) {
            return;
          }

          const messages = invoice.payments[0].messages;

          let customRecords: { [key: string]: string } = {};
          messages.map(message => {
            const { type, value } = message;

            const obj = decodeMessage({ type, value });
            customRecords = { ...customRecords, ...obj };
          });

          if (Object.keys(customRecords).length <= 0) {
            return;
          }

          let isVerified = false;

          if (customRecords.signature) {
            const messageToVerify = JSON.stringify({
              sender: customRecords.sender,
              message: customRecords.message,
            });

            const [verified, error] = await toWithError(
              this.nodeService.verifyMessage(
                user.id,
                messageToVerify,
                customRecords.signature
              )
            );
            if (error) {
              this.logger.debug(`Error verifying message: ${messageToVerify}`);
            }

            if (
              !error &&
              (verified as { signed_by: string })?.signed_by ===
                customRecords.sender
            ) {
              isVerified = true;
            }
          }

          return {
            date: invoice.confirmed_at,
            id: invoice.id,
            tokens: invoice.tokens,
            verified: isVerified,
            ...customRecords,
          };
        })
      );

    const filtered = await getFiltered();
    const final = filtered.filter(Boolean) || [];

    return { token: invoiceList.next, messages: final };
  }

  @Mutation(() => Number)
  async sendMessage(
    @CurrentUser() user: UserId,
    @Args('publicKey') publicKey: string,
    @Args('message') message: string,
    @Args('messageType', { nullable: true }) messageType: string,
    @Args('tokens', { nullable: true }) tokens: number,
    @Args('maxFee', { nullable: true }) maxFee: number
  ) {
    let satsToSend = tokens || 1;
    let messageToSend = message;
    if (messageType === 'paymentrequest') {
      satsToSend = 1;
      messageToSend = `${tokens},${message}`;
    }

    const nodeInfo = await this.nodeService.getWalletInfo(user.id);

    const userAlias = nodeInfo.alias;
    const userKey = nodeInfo.public_key;

    const preimage = randomBytes(32);
    const secret = preimage.toString('hex');
    const id = createHash('sha256').update(preimage).digest().toString('hex');

    const messageToSign = JSON.stringify({
      sender: userKey,
      message: messageToSend,
    });

    const { signature } = await this.nodeService.signMessage(
      user.id,
      messageToSign
    );

    const customRecords = createCustomRecords({
      message: messageToSend,
      sender: userKey,
      alias: userAlias,
      contentType: messageType || 'text',
      requestType: messageType || 'text',
      signature,
      secret,
    });

    const { safe_fee } = await this.nodeService.payViaPaymentDetails(user.id, {
      id,
      tokens: satsToSend,
      destination: publicKey,
      ...(maxFee ? { max_fee: maxFee } : {}),
      messages: customRecords,
    });

    // +1 is needed so that a fee of 0 doesnt evaluate to false
    return safe_fee + 1;
  }
}
