import { Args, Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
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
    let backupObj = { backup: '', channels: [] };
    try {
      backupObj = JSON.parse(backupString);
    } catch (error: any) {
      this.logger.error('Corrupt backup file', { error });
      throw new Error('Corrupt backup file');
    }

    const { backup, channels } = backupObj;

    const { is_valid } = await this.nodeService.verifyBackups(
      id,
      backup,
      channels
    );
    return is_valid;
  }

  @Query(() => Boolean)
  async recoverFunds(
    @Args('backup') backupString: string,
    @CurrentUser() { id }: UserId
  ) {
    let backupObj = { backup: '' };
    try {
      backupObj = JSON.parse(backupString);
    } catch (error: any) {
      this.logger.error('Corrupt backup file', { error });
      throw new Error('Corrupt backup file');
    }

    const { backup } = backupObj;

    await this.nodeService.recoverFundsFromChannels(id, backup);
    return true;
  }

  @Query(() => String)
  async getBackups(@CurrentUser() { id }: UserId) {
    const backups = await this.nodeService.getBackups(id);
    return JSON.stringify(backups);
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
