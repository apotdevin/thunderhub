import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE, DrizzleProvider } from '../database/drizzle.provider';
import { and, asc, count, eq, sql } from 'drizzle-orm';
import { hash, verify } from '@node-rs/argon2';
import { encryptValue } from '../../utils/encryption/field-encryption';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(DRIZZLE) private readonly drizzle: DrizzleProvider,
    private readonly configService: ConfigService
  ) {}

  isDbEnabled(): boolean {
    return this.drizzle !== null;
  }

  async hasUsers(): Promise<boolean> {
    if (!this.drizzle) return false;

    const { db, schema } = this.drizzle;
    const rows = await (db as any)
      .select({ count: count() })
      .from(schema.users);

    return Number(rows[0]?.count ?? 0) > 0;
  }

  async needsSetup(): Promise<boolean> {
    if (!this.isDbEnabled()) return false;
    return !(await this.hasUsers());
  }

  async createInitialUser(
    email: string,
    password: string
  ): Promise<{ id: string; email: string; role: string }> {
    if (!this.drizzle) {
      throw new Error('Database is not enabled');
    }

    const hasExistingUsers = await this.hasUsers();
    if (hasExistingUsers) {
      throw new Error('Initial setup has already been completed');
    }

    const { db, schema } = this.drizzle;
    const passwordHash = await hash(password);

    const teamRows = await (db as any)
      .insert(schema.teams)
      .values({ name: 'Default' })
      .returning({ id: schema.teams.id });

    const teamId = teamRows[0]?.id;
    if (!teamId) {
      throw new Error('Failed to create default team');
    }

    const userRows = await (db as any)
      .insert(schema.users)
      .values({
        email,
        password_hash: passwordHash,
        role: 'owner',
        team_id: teamId,
      })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        role: schema.users.role,
      });

    if (!userRows[0]) {
      throw new Error('Failed to create owner user');
    }

    this.logger.log(`Initial owner user created: ${email}`);

    return userRows[0];
  }

  async getUserNodeSlugs(
    userId: string
  ): Promise<{ slug: string; name: string }[]> {
    if (!this.drizzle) return [];

    const { db, schema } = this.drizzle;
    const rows = await (db as any)
      .select({
        id: schema.nodes.id,
        name: schema.nodes.name,
      })
      .from(schema.nodes)
      .innerJoin(
        schema.userNodes,
        eq(schema.userNodes.node_id, schema.nodes.id)
      )
      .where(eq(schema.userNodes.user_id, userId))
      .orderBy(asc(schema.nodes.name));

    return rows.map((r: { id: string; name: string }) => ({
      slug: r.id.slice(0, 8),
      name: r.name,
    }));
  }

  async getUserByEmail(email: string): Promise<{
    id: string;
    email: string;
    password_hash: string;
    role: string;
  } | null> {
    if (!this.drizzle) return null;

    const { db, schema } = this.drizzle;
    const rows = await (db as any)
      .select({
        id: schema.users.id,
        email: schema.users.email,
        password_hash: schema.users.password_hash,
        role: schema.users.role,
      })
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    return rows[0] || null;
  }

  async verifyPassword(
    passwordHash: string,
    password: string
  ): Promise<boolean> {
    return verify(passwordHash, password);
  }

  async addNode(
    userId: string,
    input: {
      name: string;
      type: string;
      socket: string;
      macaroon: string;
      cert?: string;
    }
  ): Promise<{ id: string; name: string }> {
    if (!this.drizzle) {
      throw new Error('Database is not enabled');
    }

    const { db, schema } = this.drizzle;

    // Get user's team_id
    const userRows = await (db as any)
      .select({ team_id: schema.users.team_id })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    const teamId = userRows[0]?.team_id;
    if (!teamId) {
      throw new Error('User not found');
    }

    const encryptionKey = this.configService.get<string>(
      'database.encryptionKey'
    );

    const encryptedMacaroon = encryptionKey
      ? encryptValue(input.macaroon, encryptionKey)
      : input.macaroon;

    const encryptedCert =
      input.cert && encryptionKey
        ? encryptValue(input.cert, encryptionKey)
        : input.cert || null;

    const nodeRows = await (db as any)
      .insert(schema.nodes)
      .values({
        team_id: teamId,
        name: input.name,
        type: input.type,
        network: 'mainnet',
        socket: input.socket,
        encrypted_macaroon: encryptedMacaroon,
        encrypted_cert: encryptedCert,
      })
      .returning({ id: schema.nodes.id, name: schema.nodes.name });

    const node = nodeRows[0];
    if (!node) {
      throw new Error('Failed to create node');
    }

    // Link user to node
    await (db as any).insert(schema.userNodes).values({
      user_id: userId,
      node_id: node.id,
    });

    this.logger.log(`Node "${input.name}" added for user ${userId}`);

    return node;
  }

  async deleteNode(userId: string, slug: string): Promise<string> {
    if (!this.drizzle) {
      throw new Error('Database is not enabled');
    }

    const { db, schema } = this.drizzle;

    // Find the node by slug (first 8 chars of id) and verify user owns it
    const rows = await (db as any)
      .select({ node_id: schema.userNodes.node_id })
      .from(schema.userNodes)
      .innerJoin(schema.nodes, eq(schema.nodes.id, schema.userNodes.node_id))
      .where(
        and(
          eq(schema.userNodes.user_id, userId),
          sql`SUBSTR(${schema.nodes.id}, 1, 8) = ${slug}`
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row) {
      throw new Error('Node not found');
    }

    const nodeId = row.node_id;

    // Delete user-node link first, then the node
    await (db as any)
      .delete(schema.userNodes)
      .where(eq(schema.userNodes.node_id, nodeId));

    await (db as any).delete(schema.nodes).where(eq(schema.nodes.id, nodeId));

    this.logger.log(`Node ${nodeId} deleted by user ${userId}`);

    return nodeId;
  }

  async editNode(
    userId: string,
    slug: string,
    input: { name?: string }
  ): Promise<{ id: string; name: string }> {
    if (!this.drizzle) {
      throw new Error('Database is not enabled');
    }

    const { db, schema } = this.drizzle;

    // Find the node by slug and verify user owns it
    const rows = await (db as any)
      .select({
        node_id: schema.userNodes.node_id,
        name: schema.nodes.name,
      })
      .from(schema.userNodes)
      .innerJoin(schema.nodes, eq(schema.nodes.id, schema.userNodes.node_id))
      .where(
        and(
          eq(schema.userNodes.user_id, userId),
          sql`SUBSTR(${schema.nodes.id}, 1, 8) = ${slug}`
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row) {
      throw new Error('Node not found');
    }

    const nodeId = row.node_id;
    const updates: Record<string, any> = {};

    if (input.name !== undefined) {
      updates.name = input.name;
    }

    if (Object.keys(updates).length === 0) {
      return { id: nodeId, name: row.name };
    }

    const updated = await (db as any)
      .update(schema.nodes)
      .set(updates)
      .where(eq(schema.nodes.id, nodeId))
      .returning({ id: schema.nodes.id, name: schema.nodes.name });

    const node = updated[0];
    if (!node) {
      throw new Error('Failed to update node');
    }

    this.logger.log(`Node ${nodeId} updated by user ${userId}`);

    return node;
  }
}
