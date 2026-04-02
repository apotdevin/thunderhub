import { Inject, Injectable, Logger } from '@nestjs/common';
import { DRIZZLE, DrizzleProvider } from '../database/drizzle.provider';
import { count } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@Inject(DRIZZLE) private readonly drizzle: DrizzleProvider) {}

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
}
