import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { sortBy } from 'lodash';
import { ChainAddressSend, ChainTransaction, Utxo } from './chain.types';
import { SendToChainAddressArgs } from 'lightning';

@Resolver()
export class ChainResolver {
  constructor(private nodeService: NodeService) {}

  @Query(() => [ChainTransaction])
  async getChainTransactions(@CurrentUser() { id }: UserId) {
    const transactionList = await this.nodeService.getChainTransactions(id);

    const transactions = sortBy(
      transactionList.transactions,
      'created_at'
    ).reverse();

    return transactions;
  }

  @Query(() => [Utxo])
  async getUtxos(@CurrentUser() { id }: UserId) {
    const info = await this.nodeService.getUtxos(id);
    return info?.utxos;
  }

  @Mutation(() => String)
  async createAddress(@CurrentUser() { id }: UserId) {
    const address = await this.nodeService.createChainAddress(id);
    return address.address;
  }

  @Mutation(() => ChainAddressSend)
  async sendToAddress(
    @Args('address') address: string,
    @Args('tokens', { nullable: true }) tokens: number,
    @Args('fee', { nullable: true }) fee: number,
    @Args('target', { nullable: true }) target: number,
    @Args('sendAll', { nullable: true }) sendAllFlag: boolean,
    @CurrentUser() { id }: UserId
  ) {
    const props = fee
      ? { fee_tokens_per_vbyte: fee }
      : target
      ? { target_confirmations: target }
      : {};

    const hasTokens = tokens && !sendAllFlag ? { tokens } : {};
    const sendAll = sendAllFlag ? { is_send_all: true } : {};

    const options = {
      address,
      ...hasTokens,
      ...props,
      ...sendAll,
    } as SendToChainAddressArgs;

    const send = await this.nodeService.sendToChainAddress(id, options);

    return {
      confirmationCount: send.confirmation_count,
      id: send.id,
      isConfirmed: send.is_confirmed,
      isOutgoing: send.is_outgoing,
      ...(send.tokens && { tokens: send.tokens }),
    };
  }
}
