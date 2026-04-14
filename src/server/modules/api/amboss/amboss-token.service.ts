import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { DRIZZLE, DrizzleProvider } from '../../database/drizzle.provider';
import {
  decryptValue,
  encryptValue,
} from '../../../utils/encryption/field-encryption';
import { AuthType, UserId } from '../../security/security.types';
import { AmbossService } from './amboss.service';

/**
 * Resolves, persists, and refreshes per-node Amboss JWTs.
 *
 * DB accounts → encrypted column on `nodes.encrypted_amboss_jwt`.
 * YAML accounts → in-memory map on `AccountsService` (process lifetime).
 *
 * The token is *not* sent to the browser. Callers obtain it server-side
 * via `getOrCreate` / `get` for every request that needs Amboss auth.
 */
@Injectable()
export class AmbossTokenService {
  private readonly logger = new Logger(AmbossTokenService.name);
  private readonly yamlTokens = new Map<string, string>();

  constructor(
    @Inject(DRIZZLE) private readonly drizzle: DrizzleProvider,
    private readonly configService: ConfigService,
    private readonly ambossService: AmbossService
  ) {}

  /** Returns a valid stored token, or null if missing/expired. */
  async get(user: UserId): Promise<string | null> {
    const token = await this.readStored(user);
    if (!token) return null;
    if (this.isExpired(token)) return null;
    return token;
  }

  /** Returns a valid token, generating and persisting one if needed. */
  async getOrCreate(user: UserId): Promise<string> {
    const existing = await this.get(user);
    if (existing) return existing;

    return this.forceRefresh(user);
  }

  /** Always generates and persists a fresh token, ignoring any stored value. */
  async forceRefresh(user: UserId): Promise<string> {
    const fresh = await this.ambossService.getAmbossJWT(user);
    await this.set(user, fresh);
    return fresh;
  }

  async set(user: UserId, token: string): Promise<void> {
    if (user.authType === AuthType.USER) {
      await this.writeDbToken(user.id, token);
      return;
    }
    this.yamlTokens.set(user.id, token);
  }

  /** Removes any stored token, effectively logging the node out of Amboss. */
  async clear(user: UserId): Promise<void> {
    if (user.authType === AuthType.USER) {
      await this.clearDbToken(user.id);
      return;
    }
    this.yamlTokens.delete(user.id);
  }

  private async readStored(user: UserId): Promise<string | null> {
    if (user.authType === AuthType.USER) {
      return this.readDbToken(user.id);
    }
    return this.yamlTokens.get(user.id) ?? null;
  }

  private isExpired(token: string): boolean {
    // Amboss returns opaque API keys that may or may not be JWTs. If the
    // token decodes as a JWT with an `exp`, honor it (with 60s leeway so we
    // refresh just before expiry). Anything else is treated as still valid —
    // the downstream Amboss call will reject it if it's actually bad.
    try {
      const decoded = jwt.decode(token);
      if (!decoded || typeof decoded !== 'object') return false;
      const exp = (decoded as { exp?: number }).exp;
      if (!exp) return false;
      return exp * 1000 <= Date.now() + 60_000;
    } catch {
      return false;
    }
  }

  private async readDbToken(nodeId: string): Promise<string | null> {
    if (!this.drizzle) return null;
    const { db, schema } = this.drizzle;

    const rows = await (db as any)
      .select({ encrypted: schema.nodes.encrypted_amboss_jwt })
      .from(schema.nodes)
      .where(eq(schema.nodes.id, nodeId))
      .limit(1);

    const encrypted = rows[0]?.encrypted;
    if (!encrypted) return null;

    const key = this.configService.get<string>('database.encryptionKey');
    if (!key) return encrypted;

    try {
      return decryptValue(encrypted, key);
    } catch (err) {
      this.logger.error(`Failed to decrypt Amboss JWT for node ${nodeId}`, {
        err,
      });
      return null;
    }
  }

  private async clearDbToken(nodeId: string): Promise<void> {
    if (!this.drizzle) return;
    const { db, schema } = this.drizzle;

    await (db as any)
      .update(schema.nodes)
      .set({ encrypted_amboss_jwt: null })
      .where(eq(schema.nodes.id, nodeId));
  }

  private async writeDbToken(nodeId: string, token: string): Promise<void> {
    if (!this.drizzle) return;
    const { db, schema } = this.drizzle;

    const key = this.configService.get<string>('database.encryptionKey');
    const value = key ? encryptValue(token, key) : token;

    await (db as any)
      .update(schema.nodes)
      .set({ encrypted_amboss_jwt: value })
      .where(eq(schema.nodes.id, nodeId));
  }
}
