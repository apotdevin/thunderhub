import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../files/files.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EnrichedAccount } from './accounts.types';
import { ProviderRegistryService } from '../node/provider-registry.service';
import { NodeType } from '../node/lightning.types';
import { DRIZZLE, DrizzleProvider } from '../database/drizzle.provider';
import { decryptValue } from '../../utils/encryption/field-encryption';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class AccountsService implements OnModuleInit {
  accounts: { [key: string]: EnrichedAccount } = {};

  constructor(
    private configService: ConfigService,
    private filesService: FilesService,
    private providerRegistry: ProviderRegistryService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(DRIZZLE) private readonly drizzle: DrizzleProvider
  ) {}

  async onModuleInit(): Promise<void> {
    // Initialize cookie file if cookie path is provided
    this.filesService.readCookie();

    const macaroonPath = this.configService.get('sso.macaroonPath');
    const certPath = this.configService.get('sso.certPath');
    const accountConfigPath = this.configService.get('accountConfigPath');

    const ssoUrl = this.configService.get('sso.serverUrl');
    const ssoMacaroon = this.filesService.readMacaroons(macaroonPath);
    const ssoCert = this.filesService.readFile(certPath);

    if (ssoUrl && ssoMacaroon) {
      if (!ssoCert) {
        this.logger.warning(
          'No certificate provided for SSO account. Make sure you do not need it to connect.'
        );
      }

      const ssoNodeType = this.configService.get<NodeType>(
        'sso.nodeType',
        NodeType.LND
      );

      const sso = {
        type: ssoNodeType,
        index: 999,
        name: 'SSO Account',
        id: '',
        password: '',
        encrypted: false,
        encryptedMacaroon: '',
        macaroon: ssoMacaroon,
        socket: ssoUrl,
        cert: ssoCert,
        twofaSecret: '',
      };

      const provider = this.providerRegistry.getProvider(ssoNodeType);
      const connection = provider.connect({
        socket: ssoUrl,
        cert: ssoCert || undefined,
        macaroon: ssoMacaroon,
      });

      this.accounts['sso'] = {
        ...sso,
        hash: 'sso',
        slug: 'sso',
        connection,
      };
    }

    const accounts = this.filesService.getAccounts(accountConfigPath);

    if (!accounts.length) return;

    accounts.forEach(account => {
      const nodeType = account.type || NodeType.LND;

      if (!this.providerRegistry.hasProvider(nodeType)) {
        this.logger.error(
          `No provider registered for account type "${nodeType}" (account: ${account.name}). Skipping.`
        );
        return;
      }

      const provider = this.providerRegistry.getProvider(nodeType);
      const connection = provider.connect({
        socket: account.socket,
        cert: account.cert || undefined,
        macaroon: account.macaroon || undefined,
        authToken: account.authToken,
      });

      this.accounts[account.hash] = {
        ...account,
        type: nodeType,
        connection,
      };
    });
  }

  getAccount(id: string) {
    if (!id) return null;
    return this.accounts[id] || null;
  }

  getAccountBySlug(slug: string): EnrichedAccount | null {
    if (!slug) return null;
    for (const key of Object.keys(this.accounts)) {
      const account = this.accounts[key];
      if (account.slug === slug) {
        return account;
      }
    }
    return null;
  }

  async getDbNodeBySlug(
    slug: string,
    userId: string
  ): Promise<EnrichedAccount | null> {
    if (!slug || !this.drizzle) return null;

    // Check cache first (try slug-based lookup)
    for (const key of Object.keys(this.accounts)) {
      const acct = this.accounts[key];
      if (acct.slug === slug) return acct;
    }

    const { db, schema } = this.drizzle;

    const rows = await (db as any)
      .select()
      .from(schema.nodes)
      .innerJoin(
        schema.userNodes,
        eq(schema.userNodes.node_id, schema.nodes.id)
      )
      .where(eq(schema.userNodes.user_id, userId))
      .where(sql`SUBSTR(${schema.nodes.id}, 1, 8) = ${slug}`)
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    const node = row.nodes;
    const nodeType = (node.type as NodeType) || NodeType.LND;

    if (!this.providerRegistry.hasProvider(nodeType)) {
      this.logger.error(
        `No provider registered for DB node type "${nodeType}" (node: ${node.name})`
      );
      return null;
    }

    const encryptionKey = this.configService.get<string>(
      'database.encryptionKey'
    );

    const macaroon =
      node.encrypted_macaroon && encryptionKey
        ? decryptValue(node.encrypted_macaroon, encryptionKey)
        : undefined;

    const cert =
      node.encrypted_cert && encryptionKey
        ? decryptValue(node.encrypted_cert, encryptionKey)
        : undefined;

    const provider = this.providerRegistry.getProvider(nodeType);
    const connection = provider.connect({
      socket: node.socket,
      cert,
      macaroon,
    });

    const enriched: EnrichedAccount = {
      type: nodeType,
      index: 0,
      name: node.name,
      hash: node.id,
      slug: node.id.slice(0, 8),
      socket: node.socket,
      macaroon: macaroon || '',
      cert: cert || '',
      password: '',
      encrypted: false,
      encryptedMacaroon: '',
      twofaSecret: '',
      connection,
    };

    this.accounts[node.id] = enriched;

    return enriched;
  }

  getAllAccounts() {
    return this.accounts;
  }

  removeAccount(id: string): void {
    delete this.accounts[id];
  }

  updateAccountMacaroon(id: string, macaroon: string): void {
    if (this.accounts?.[id]) {
      const account = this.accounts[id];
      const provider = this.providerRegistry.getProvider(account.type);
      const connection = provider.connect({
        socket: account.socket,
        cert: account.cert || undefined,
        macaroon,
      });

      this.accounts[id].macaroon = macaroon;
      this.accounts[id].connection = connection;
    } else {
      this.logger.error(`Account not found to update macaroon`, { id });
    }
  }

  async getNodeDetails(id: string): Promise<{
    id: string;
    socket: string;
    created_at?: string;
    network?: string;
  } | null> {
    const account = this.getAccount(id);
    if (!account) return null;

    const base = {
      id: account.hash,
      socket: account.socket,
    };

    if (!this.drizzle) return base;

    const { db, schema } = this.drizzle;

    try {
      const rows = await (db as any)
        .select({
          id: schema.nodes.id,
          network: schema.nodes.network,
          created_at: schema.nodes.created_at,
          socket: schema.nodes.socket,
        })
        .from(schema.nodes)
        .where(eq(schema.nodes.id, account.hash))
        .limit(1);

      if (rows[0]) {
        return {
          id: rows[0].id,
          socket: rows[0].socket,
          created_at: rows[0].created_at,
          network: rows[0].network,
        };
      }
    } catch {
      // DB not available or node not in DB (YAML account)
    }

    return base;
  }

  updateAccountSecret(id: string, secret: string): void {
    if (this.accounts?.[id]) {
      this.accounts[id].twofaSecret = secret;
    } else {
      this.logger.error(`Account not found to update 2FA secret`, { id });
      throw new Error('Error updating 2FA for account.');
    }
  }
}
