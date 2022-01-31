import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NodeService } from '../../node/node.service';
import { UserId } from '../../security/security.types';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateMacaroon, NetworkInfoInput } from './macaroon.types';
import { CurrentUser } from '../../security/security.decorators';

@Resolver()
export class MacaroonResolver {
  constructor(
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Mutation(() => CreateMacaroon)
  async createMacaroon(
    @Args('permissions') permissions: NetworkInfoInput,
    @CurrentUser() { id }: UserId
  ) {
    const { macaroon, permissions: permissionList } =
      await this.nodeService.grantAccess(id, permissions);

    this.logger.debug('Macaroon created with the following permissions', {
      permissions: permissionList.join(', '),
    });

    const hex = Buffer.from(macaroon, 'base64').toString('hex');

    return { base: macaroon, hex };
  }
}
