import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ContextType } from 'src/server/app.module';
import { AccountsService } from '../../accounts/accounts.service';
import { CurrentUser, Public } from '../../security/security.decorators';
import {
  AddNodeInput,
  AddNodeResult,
  DeleteNodeResult,
  EditNodeInput,
  EditNodeResult,
  PublicQueries,
  ServerAccount,
  TeamMutations,
  UserQueries,
  UserNode,
} from './account.types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { UserId, AuthType, parseSubject } from '../../security/security.types';
import { Throttle, seconds } from '@nestjs/throttler';
import { UserService } from '../../user/user.service';
import { ProviderRegistryService } from '../../node/provider-registry.service';
import { getNetwork } from '../../../utils/network';

@Resolver()
export class AccountResolver {
  constructor(
    private accountsService: AccountsService,
    private userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => ServerAccount)
  async getAccount(@CurrentUser() user: UserId): Promise<ServerAccount> {
    if (user.authType === AuthType.USER) {
      const dbUserId = user.userId ?? user.id;
      const nodes = await this.userService.getUserNodeSlugs(dbUserId);

      if (!nodes.length) {
        return {
          name: 'Account',
          id: user.id,
          slug: 'db',
          loggedIn: true,
          type: 'db',
          twofaEnabled: false,
          hasNode: false,
        };
      }

      return {
        name: nodes[0].name,
        id: user.id,
        slug: nodes[0].slug,
        loggedIn: true,
        type: 'db',
        twofaEnabled: false,
        hasNode: true,
      };
    }

    const currentAccount = this.accountsService.getAccount(user.id);

    if (!currentAccount) {
      this.logger.error(`No account found for id ${user.id}`);
      throw new Error('NoAccountFound');
    }

    if (user.id === 'sso') {
      return {
        name: 'SSO Account',
        id: 'sso',
        slug: 'sso',
        loggedIn: true,
        type: 'sso',
        twofaEnabled: false,
      };
    }

    return {
      name: currentAccount.name,
      id: user.id,
      slug: currentAccount.slug || user.id.slice(0, 8),
      loggedIn: true,
      type: 'server',
      twofaEnabled: !!currentAccount.twofaSecret,
    };
  }

  @Public()
  @Throttle({ default: { limit: 4, ttl: seconds(10) } })
  @Query(() => PublicQueries)
  async public() {
    return {};
  }
}

@Resolver()
export class UserQueryRoot {
  @Query(() => UserQueries)
  async user(@CurrentUser() user: UserId): Promise<UserQueries> {
    if (user.authType !== AuthType.USER) {
      throw new Error('Only database accounts can access user queries');
    }
    return {} as any;
  }
}

@Resolver()
export class TeamMutationRoot {
  @Mutation(() => TeamMutations)
  async team(@CurrentUser() user: UserId): Promise<TeamMutations> {
    if (user.authType !== AuthType.USER) {
      throw new Error('Only database accounts can access team mutations');
    }
    return {} as any;
  }
}

@Resolver(() => TeamMutations)
export class TeamMutationsResolver {
  constructor(
    private userService: UserService,
    private accountsService: AccountsService,
    private providerRegistry: ProviderRegistryService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ResolveField(() => AddNodeResult)
  async add_node(
    @CurrentUser() user: UserId,
    @Args('input') input: AddNodeInput
  ): Promise<AddNodeResult> {
    const { name, lnd, litd } = input;

    const configs = [
      lnd && { type: 'lnd' as const, ...lnd },
      litd && { type: 'litd' as const, ...litd },
    ].filter(Boolean);

    if (configs.length !== 1) {
      throw new Error('Exactly one node type (lnd or litd) must be provided');
    }

    const config = configs[0]!;

    // Test connection before saving and detect the node's network
    const provider = this.providerRegistry.getProvider(config.type);
    let network: string | undefined;
    try {
      const connection = provider.connect({
        socket: config.socket,
        macaroon: config.macaroon,
        cert: config.cert,
      });
      await provider.verifyConnection(connection);
      const walletInfo = await provider.getWalletInfo(connection);
      network = getNetwork(walletInfo?.chains?.[0] || '');
    } catch (error: any) {
      throw new Error(
        `Failed to connect to node: ${error.message || 'Unknown error'}`
      );
    }

    const dbUserId = user.userId ?? user.id;

    this.logger.info('Adding node for DB user', {
      userId: dbUserId,
      name,
      type: config.type,
      socket: config.socket,
      network,
    });

    const node = await this.userService.addNode(dbUserId, {
      name,
      type: config.type,
      socket: config.socket,
      macaroon: config.macaroon,
      cert: config.cert,
      network,
    });

    return {
      id: node.id,
      slug: node.id.slice(0, 8),
      name: node.name,
    };
  }

  @ResolveField(() => EditNodeResult)
  async edit_node(
    @CurrentUser() user: UserId,
    @Args('input') input: EditNodeInput
  ): Promise<EditNodeResult> {
    const dbUserId = user.userId ?? user.id;

    // Re-detect the node's network from its live connection so the stored
    // value stays truthful (e.g. a mis-detected mainnet node that's actually
    // mutinynet will self-correct on the next edit).
    let network: string | undefined;
    try {
      const account = await this.accountsService.getDbNodeBySlug(
        input.slug,
        dbUserId
      );
      if (account) {
        const provider = this.providerRegistry.getProvider(account.type);
        const walletInfo = await provider.getWalletInfo(account.connection);
        network = getNetwork(walletInfo?.chains?.[0] || '');
      }
    } catch (err) {
      this.logger.warn('Failed to re-detect network during edit_node', {
        slug: input.slug,
        err,
      });
    }

    const node = await this.userService.editNode(dbUserId, input.slug, {
      name: input.name,
      network,
    });

    return {
      id: node.id,
      slug: node.id.slice(0, 8),
      name: node.name,
    };
  }

  @ResolveField(() => DeleteNodeResult)
  async delete_node(
    @CurrentUser() user: UserId,
    @Args('slug') slug: string
  ): Promise<DeleteNodeResult> {
    const dbUserId = user.userId ?? user.id;

    this.logger.info('Deleting node for DB user', {
      userId: dbUserId,
      slug,
    });

    const nodeId = await this.userService.deleteNode(dbUserId, slug);

    // Evict cached connection
    this.accountsService.removeAccount(nodeId);

    return { success: true };
  }
}

@Resolver(() => UserQueries)
export class UserQueriesResolver {
  constructor(private userService: UserService) {}

  @ResolveField(() => [UserNode])
  async get_nodes(@CurrentUser() user: UserId): Promise<UserNode[]> {
    const dbUserId = user.userId ?? user.id;
    const nodes = await this.userService.getUserNodeSlugs(dbUserId);
    return nodes.map(n => ({
      id: n.slug,
      slug: n.slug,
      name: n.name,
      network: n.network,
      type: n.type,
    }));
  }
}

@Resolver(() => PublicQueries)
export class PublicQueriesResolver {
  constructor(
    private accountsService: AccountsService,
    private userService: UserService
  ) {}

  @ResolveField(() => [ServerAccount])
  async get_server_accounts(
    @Context() { authToken }: ContextType
  ): Promise<ServerAccount[]> {
    const parsed = authToken?.sub ? parseSubject(authToken.sub) : undefined;
    const currentAccount = this.accountsService.getAccount(parsed?.id);
    const accounts = this.accountsService.getAllAccounts();

    const mapped: ServerAccount[] = [];

    for (const key in accounts) {
      if (Object.prototype.hasOwnProperty.call(accounts, key)) {
        const account = accounts[key];
        const { name, hash } = account;

        if (currentAccount?.hash === 'sso' || key !== 'sso') {
          mapped.push({
            name,
            id: hash,
            slug: key === 'sso' ? 'sso' : account.slug || hash.slice(0, 8),
            loggedIn: currentAccount?.hash === key,
            type: key === 'sso' ? 'sso' : 'server',
            twofaEnabled: false,
          });
        }
      }
    }

    // Add a DB account entry when the database has users
    const dbHasUsers = await this.userService.hasUsers();
    if (dbHasUsers) {
      const isDbLoggedIn = !!parsed && parsed.authType === AuthType.USER;

      mapped.push({
        name: 'Account Login',
        id: 'db',
        slug: 'db',
        loggedIn: isDbLoggedIn,
        type: 'db',
        twofaEnabled: false,
      });
    }

    return mapped;
  }
}
