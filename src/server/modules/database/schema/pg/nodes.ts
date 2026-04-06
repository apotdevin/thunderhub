import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { teams } from './teams';

export const nodes = pgTable('nodes', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  team_id: uuid('team_id')
    .notNull()
    .references(() => teams.id),
  name: text('name').notNull(),
  type: text('type').notNull(),
  network: text('network').notNull(),
  socket: text('socket').notNull(),
  encrypted_macaroon: text('encrypted_macaroon'),
  encrypted_cert: text('encrypted_cert'),
  created_at: timestamp('created_at', { precision: 6, mode: 'string' })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { precision: 6, mode: 'string' })
    .notNull()
    .defaultNow(),
});
