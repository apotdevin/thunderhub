import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { teams } from './teams';

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: text('role', { enum: ['owner', 'admin', 'member'] })
    .notNull()
    .default('member'),
  team_id: uuid('team_id')
    .notNull()
    .references(() => teams.id),
  created_at: timestamp('created_at', { precision: 6, mode: 'string' })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { precision: 6, mode: 'string' })
    .notNull()
    .defaultNow(),
});
