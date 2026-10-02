import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AccountsService } from '../accounts/accounts.service';
import { EnrichedAccount } from '../accounts/accounts.types';
import { YamlUser } from '../files/yaml-users';
import { UserService } from '../user/user.service';
import { isCorrectPassword } from '../../utils/crypto';
import { AuthType, parseSubject, toSubject } from '../security/security.types';
import {
  Principal,
  PrincipalCapabilities,
  PrincipalInfo,
  PrincipalNode,
} from './principal.types';

const SSO_ACCOUNT = 'sso';

/**
 * Single place that knows what a session subject is and which nodes it may
 * open. Guards and resolvers ask this service instead of branching on
 * `AuthType` themselves.
 */
@Injectable()
export class PrincipalService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  fromSubject(sub: string): Principal {
    return parseSubject(sub);
  }

  toSubject(principal: Principal): string {
    return toSubject(principal);
  }

  /**
   * Resolves the identifier a trusted reverse proxy sent. YAML users are
   * matched first by id, then database users by email.
   */
  async fromTrustedIdentifier(identifier: string): Promise<Principal | null> {
    const id = identifier.trim().toLowerCase();
    if (!id) return null;

    const yamlUser = this.accountsService.getYamlUser(id);
    if (yamlUser) {
      return this.yamlUserPrincipal(yamlUser, 'the trusted header');
    }

    if (this.userService.isDbEnabled()) {
      const userId = await this.userService.findUserIdByEmail(id);
      if (userId) return { type: AuthType.USER, id: userId };
    }

    return null;
  }

  /**
   * Resolves an identifier and password typed into the login form. A YAML
   * user with a password is checked first; otherwise the database is asked.
   * The password is the SHA-256 digest the form sends, not the plain text.
   */
  async fromCredentials(
    identifier: string,
    password: string
  ): Promise<Principal | null> {
    const id = identifier.trim().toLowerCase();
    if (!id || !password) return null;

    const yamlUser = this.accountsService.getYamlUser(id);
    if (yamlUser) {
      if (!yamlUser.password) {
        this.logger.debug(`YAML user "${id}" has no password login`);
        return null;
      }
      if (!isCorrectPassword(password, yamlUser.password)) {
        this.logger.error(`Wrong password for YAML user "${id}"`);
        return null;
      }
      return this.yamlUserPrincipal(yamlUser, 'the login');
    }

    if (!this.userService.isDbEnabled()) return null;

    const user = await this.userService.getUserByEmail(identifier);
    if (!user) {
      this.logger.debug(`DB user not found for email: ${identifier}`);
      return null;
    }

    const isValid = await this.userService.verifyPassword(
      user.password_hash,
      password
    );
    if (!isValid) {
      this.logger.error('DB authentication failed - invalid password');
      return null;
    }

    return { type: AuthType.USER, id: user.id };
  }

  /** A YAML user is only useful when at least one account lists them. */
  private yamlUserPrincipal(user: YamlUser, via: string): Principal | null {
    if (!this.accountsService.getAccountsForYamlUser(user.id).length) {
      this.logger.warn(
        `YAML user "${user.id}" is not allowed on any account. Refusing ${via}.`
      );
      return null;
    }
    return { type: AuthType.YAML_USER, id: user.id };
  }

  capabilities(principal: Principal): PrincipalCapabilities {
    switch (principal.type) {
      case AuthType.USER:
        return {
          kind: 'db',
          canManageNodes: true,
          canUseTwofa: false,
          hasDatabaseUser: true,
        };
      case AuthType.YAML_USER:
        return {
          kind: 'yaml-user',
          canManageNodes: false,
          canUseTwofa: false,
          hasDatabaseUser: false,
        };
      case AuthType.YAML:
      default: {
        const isSso = principal.id === SSO_ACCOUNT;
        return {
          kind: isSso ? 'sso' : 'server',
          canManageNodes: false,
          canUseTwofa: !isSso,
          hasDatabaseUser: false,
        };
      }
    }
  }

  /** Whether the subject still refers to something the server knows. */
  async exists(principal: Principal): Promise<boolean> {
    return (await this.describe(principal)) !== null;
  }

  /** Capabilities plus what the UI shows for this person. Null if unknown. */
  async describe(principal: Principal): Promise<PrincipalInfo | null> {
    const capabilities = this.capabilities(principal);

    switch (principal.type) {
      case AuthType.USER: {
        const user = await this.userService.getUserById(principal.id);
        if (!user) return null;
        return {
          ...capabilities,
          displayName: user.email,
          twofaEnabled: false,
        };
      }
      case AuthType.YAML_USER: {
        const user = this.accountsService.getYamlUser(principal.id);
        if (!user) return null;
        return { ...capabilities, displayName: user.name, twofaEnabled: false };
      }
      case AuthType.YAML:
      default: {
        const account = this.accountsService.getAccount(principal.id);
        if (!account) return null;
        return {
          ...capabilities,
          displayName:
            principal.id === SSO_ACCOUNT ? 'SSO Account' : account.name,
          twofaEnabled: !!account.twofaSecret,
        };
      }
    }
  }

  /** Every node the principal may open, sorted for display. */
  async getNodes(principal: Principal): Promise<PrincipalNode[]> {
    switch (principal.type) {
      case AuthType.USER:
        return (await this.userService.getUserNodes(principal.id)).map(n => ({
          hash: n.id,
          slug: n.slug,
          name: n.name,
          type: n.type,
          network: n.network,
        }));
      case AuthType.YAML_USER:
        return this.accountsService
          .getAccountsForYamlUser(principal.id)
          .map(toNode);
      case AuthType.YAML:
      default: {
        const account = this.accountsService.getAccount(principal.id);
        return account ? [toNode(account)] : [];
      }
    }
  }

  /** The node behind a URL slug, or null when the principal may not open it. */
  async resolveNode(
    principal: Principal,
    slug: string
  ): Promise<EnrichedAccount | null> {
    if (!slug) return null;

    switch (principal.type) {
      case AuthType.USER:
        return this.accountsService.getDbNodeBySlug(slug, principal.id);
      case AuthType.YAML_USER:
        return (
          this.accountsService
            .getAccountsForYamlUser(principal.id)
            .find(account => account.slug === slug) ?? null
        );
      case AuthType.YAML:
      default: {
        const account = this.accountsService.getAccount(principal.id);
        return account && account.slug === slug ? account : null;
      }
    }
  }
}

const toNode = (account: EnrichedAccount): PrincipalNode => ({
  hash: account.hash,
  slug: account.slug,
  name: account.name,
  type: account.type,
});
