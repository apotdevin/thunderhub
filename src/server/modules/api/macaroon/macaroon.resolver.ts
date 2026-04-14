import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NodeService } from '../../node/node.service';
import { UserId } from '../../security/security.types';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  BakeSuperMacaroonInput,
  CreateMacaroon,
  NetworkInfoInput,
  SuperMacaroon,
} from './macaroon.types';
import { CurrentUser } from '../../security/security.decorators';
import { FetchService } from '../../fetch/fetch.service';
import { AccountsService } from '../../accounts/accounts.service';

@Resolver()
export class MacaroonResolver {
  constructor(
    private nodeService: NodeService,
    private fetchService: FetchService,
    private accountsService: AccountsService,
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

  @Mutation(() => SuperMacaroon)
  async bakeSuperMacaroon(
    @Args('input') input: BakeSuperMacaroonInput,
    @CurrentUser() { id }: UserId
  ) {
    const { rest_host, read_only } = input;

    const account = this.accountsService.getAccount(id);
    if (!account) {
      throw new Error('Account not found');
    }

    // Normalize the stored macaroon to hex for the REST header
    const storedMacaroon = account.macaroon;
    let macaroonHex: string;
    if (/^[0-9a-fA-F]+$/.test(storedMacaroon)) {
      macaroonHex = storedMacaroon;
    } else {
      macaroonHex = Buffer.from(storedMacaroon, 'base64').toString('hex');
    }

    const url = `${rest_host}/v1/proxy/supermacaroon`;

    const response = await this.fetchService.fetchWithProxy(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Grpc-Metadata-macaroon': macaroonHex,
      },
      body: JSON.stringify({
        root_key_id_suffix: '0',
        read_only,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      this.logger.error('Failed to bake super macaroon', {
        status: response.status,
        text,
      });
      throw new Error(`LITD returned ${response.status}: ${text}`);
    }

    const data = (await response.json()) as { macaroon?: string };

    if (!data.macaroon) {
      throw new Error('No macaroon returned from LITD');
    }

    // LITD returns hex-encoded macaroon
    const hex = data.macaroon;
    const base = Buffer.from(hex, 'hex').toString('base64');

    return { base, hex };
  }
}
