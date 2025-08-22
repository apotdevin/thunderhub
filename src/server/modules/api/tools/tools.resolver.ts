import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';

@Resolver()
export class ToolsResolver {
  constructor(
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => Boolean)
  async verifyBackups(
    @Args('backup') backupString: string,
    @CurrentUser() { id }: UserId
  ) {
    const { channels } = await this.nodeService.getChannels(id);

    if (!channels.length) throw new Error('No channels to verify found.');

    const channelInfo = channels.map(
      ({ transaction_id, transaction_vout }) => ({
        transaction_id,
        transaction_vout,
      })
    );

    const { is_valid } = await this.nodeService.verifyBackups(id, {
      backup: backupString,
      channels: channelInfo,
    });

    return is_valid;
  }

  @Query(() => Boolean)
  async verifyBackup(
    @Args('backup') backup: string,
    @CurrentUser() { id }: UserId
  ) {
    const { is_valid } = await this.nodeService.verifyBackup(id, backup);
    return is_valid;
  }

  @Query(() => Boolean)
  async recoverFunds(
    @Args('backup') backup: string,
    @CurrentUser() { id }: UserId
  ) {
    await this.nodeService.recoverFundsFromChannels(id, backup);
    return true;
  }

  @Query(() => String)
  async getBackups(@CurrentUser() { id }: UserId) {
    const { backup } = await this.nodeService.getBackups(id);
    return backup;
  }

  @Query(() => String)
  async verifyMessage(
    @Args('message') message: string,
    @Args('signature') signature: string,
    @CurrentUser() { id }: UserId
  ) {
    const messageSignature = await this.nodeService.verifyMessage(
      id,
      message,
      signature
    );
    return messageSignature.signed_by;
  }

  @Query(() => String)
  async signMessage(
    @Args('message') message: string,
    @CurrentUser() { id }: UserId
  ) {
    const signature = await this.nodeService.signMessage(id, message);
    return signature.signature;
  }
}
