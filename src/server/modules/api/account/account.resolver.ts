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
  SessionInfo,
  TeamMutations,
  UserQueries,
  UserNode,
} from './account.types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { UserId } from '../../security/security.types';
import { Throttle, seconds } from '@nestjs/throttler';
import { UserService } from '../../user/user.service';
import { PrincipalService } from '../../principal/principal.service';
import { ProviderRegistryService } from '../../node/provider-registry.service';
import { getNetwork } from '../../../utils/network';
import { v5 as uuidv5 } from 'uuid';

// Mask the middle of a string, keeping the first character and padding the
// rest with a fixed number of bullets so the original length isn't leaked.
const maskSegment = (value: string): string => {
  if (!value) return '';
  return `${value[0]}${'•'.repeat(4)}`;
};

const obfuscateName = (name: string): string => {
  if (!name) return '';
  // Email: mask local part and domain name but keep the TLD as a hint.
  const atIndex = name.indexOf('@');
  if (atIndex > 0) {
    const local = name.slice(0, atIndex);
    const domain = name.slice(atIndex + 1);
    const dotIndex = domain.lastIndexOf('.');
    const maskedDomain =
      dotIndex > 0
        ? `${maskSegment(domain)}${domain.slice(dotIndex)}`
        : maskSegment(domain);
    return `${maskSegment(local)}@${maskedDomain}`;
  }
  return maskSegment(name);
};

@Resolver()
export class AccountResolver {
  constructor(
    private principalService: PrincipalService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  /**
   * The current session and the node it is looking at. When the request
   * carries no node slug, the first node the principal may open is reported.
   */
  @Query(() => ServerAccount)
  async getAccount(@CurrentUser() user: UserId): Promise<ServerAccount> {
    const info = await this.principalService.describe(user.principal);

    if (!info) {
      this.logger.error(`No account found for id ${user.id}`);
      throw new Error('NoAccountFound');
    }

    const nodes = await this.principalService.getNodes(user.principal);
    const current = nodes.find(node => node.hash === user.id) ?? nodes[0];

    if (!current) {
      return {
        name: info.displayName,
        id: user.principal.id,
        slug: 'db',
        type: info.kind,
        twofaEnabled: false,
        hasNode: false,
        canManageNodes: info.canManageNodes,
      };
    }

    return {
      name: current.name,
      id: user.id,
      slug: current.slug,
      type: info.kind,
      twofaEnabled: info.twofaEnabled,
      hasNode: true,
      canManageNodes: info.canManageNodes,
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
  async user(): Promise<UserQueries> {
    return {} as any;
  }
}

@Resolver()
export class TeamMutationRoot {
  constructor(private principalService: PrincipalService) {}

  @Mutation(() => TeamMutations)
  async team(@CurrentUser() user: UserId): Promise<TeamMutations> {
    if (!this.principalService.capabilities(user.principal).canManageNodes) {
      throw new Error('This session cannot manage nodes');
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

    const dbUserId = user.principal.id;

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
    const dbUserId = user.principal.id;

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
    const dbUserId = user.principal.id;

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
  constructor(private principalService: PrincipalService) {}

  @ResolveField(() => String)
  id(): string {
    return uuidv5(UserQueriesResolver.name, uuidv5.URL);
  }

  /** Every node the session may open, whatever kind of login created it. */
  @ResolveField(() => [UserNode])
  async get_nodes(@CurrentUser() user: UserId): Promise<UserNode[]> {
    const nodes = await this.principalService.getNodes(user.principal);
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
    private userService: UserService,
    private principalService: PrincipalService
  ) {}

  /** Login options shown on the login page. */
  @ResolveField(() => [ServerAccount])
  async get_server_accounts(
    @Context() { authToken }: ContextType
  ): Promise<ServerAccount[]> {
    const current = authToken?.sub
      ? this.principalService.fromSubject(authToken.sub)
      : undefined;
    const showSso = current?.id === 'sso';
    const accounts = this.accountsService.getAllAccounts();

    const mapped: ServerAccount[] = [];

    for (const key in accounts) {
      if (!Object.prototype.hasOwnProperty.call(accounts, key)) continue;

      const account = accounts[key];

      // Database nodes are opened through their user, not from this list.
      if (account.source !== 'yaml') continue;

      // The SSO account has no password; it is only shown to its own session.
      if (key === 'sso') {
        if (showSso) {
          mapped.push({
            name: account.name,
            id: account.hash,
            slug: 'sso',
            type: 'sso',
            twofaEnabled: false,
            canManageNodes: false,
          });
        }
        continue;
      }

      // Accounts reachable only through their users have nothing to type here.
      if (!account.password) continue;

      mapped.push({
        name: account.name,
        id: account.hash,
        slug: account.slug || account.hash.slice(0, 8),
        type: 'server',
        twofaEnabled: false,
        canManageNodes: false,
      });
    }

    // Offer the identifier + password form when someone can use it: a
    // database user or a YAML user with a password.
    const hasUserLogin =
      this.accountsService.hasYamlUserPasswords() ||
      (await this.userService.hasUsers());
    if (hasUserLogin) {
      mapped.push({
        name: 'Account Login',
        id: 'db',
        slug: 'db',
        type: 'db',
        twofaEnabled: false,
        canManageNodes: true,
      });
    }

    return mapped;
  }

  @ResolveField(() => String)
  id(): string {
    // Distinct cache ID per query so Apollo caches each PublicQueries
    // response separately instead of merging partial field sets.
    return uuidv5(PublicQueriesResolver.name, uuidv5.URL);
  }

  @ResolveField(() => SessionInfo)
  async get_session_info(
    @Context() { authToken }: ContextType
  ): Promise<SessionInfo> {
    if (!authToken?.sub) {
      return { loggedIn: false };
    }

    const principal = this.principalService.fromSubject(authToken.sub);
    const info = await this.principalService.describe(principal);

    if (!info) {
      return { loggedIn: false };
    }

    // A password login is bound to one node, so the login page can jump
    // straight to it. Other sessions pick their node after `/`.
    const boundNode =
      info.kind === 'server' || info.kind === 'sso'
        ? (await this.principalService.getNodes(principal))[0]
        : undefined;

    return {
      loggedIn: true,
      type: info.kind,
      name:
        info.kind === 'sso'
          ? info.displayName
          : obfuscateName(info.displayName),
      slug: boundNode?.slug,
    };
  }
}
