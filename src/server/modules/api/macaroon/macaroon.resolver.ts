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
import { GraphQLError } from 'graphql/error';

@Resolver()
export class MacaroonResolver {
  constructor(
    private nodeService: NodeService,
    private fetchService: FetchService,
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

    // Verify the LiT super macaroon root key ID is in the node's access IDs
    const SUPER_MACAROON_ROOT_KEY_ID = '18441921392371826688';
    const { ids } = await this.nodeService.getAccessIds(id);

    const litRootKey = ids.find(
      (k: string) => k === SUPER_MACAROON_ROOT_KEY_ID
    );

    if (!litRootKey) {
      throw new GraphQLError(
        `Root key ID ${SUPER_MACAROON_ROOT_KEY_ID} is not in this node's access IDs. ` +
          'Ensure the node is running LiTD with a super macaroon root key.'
      );
    }

    // Step 1: Bake an intermediate macaroon via LND gRPC with only
    // the BakeSuperMacaroon permission, using the LiT root key
    const { macaroon: intermediateMacaroon } =
      await this.nodeService.bakeMacaroon(id, {
        permissions: [
          { entity: 'uri', action: '/litrpc.Proxy/BakeSuperMacaroon' },
        ],
        root_key_id: litRootKey,
        allow_external_permissions: true,
      });

    const intermediateMacaroonHex = Buffer.from(
      intermediateMacaroon,
      'base64'
    ).toString('hex');

    // Step 2: Call LITD super macaroon endpoint with the intermediate macaroon
    const url = `${rest_host}/v1/proxy/supermacaroon`;

    const response = await this.fetchService.fetchWithProxy(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Grpc-Metadata-macaroon': intermediateMacaroonHex,
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
      throw new GraphQLError(`LITD returned ${response.status}: ${text}`);
    }

    const data = (await response.json()) as { macaroon?: string };

    if (!data.macaroon) {
      throw new GraphQLError('No macaroon returned from LITD');
    }

    // LITD returns hex-encoded macaroon
    const hex = data.macaroon;
    const base = Buffer.from(hex, 'hex').toString('base64');

    return { base, hex };
  }
}
