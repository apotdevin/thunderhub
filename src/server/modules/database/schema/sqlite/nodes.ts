import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { teams } from './teams';

export const nodes = sqliteTable('nodes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  team_id: text('team_id')
    .notNull()
    .references(() => teams.id),
  name: text('name').notNull(),
  type: text('type').notNull(),
  network: text('network').notNull(),
  socket: text('socket').notNull(),
  encrypted_macaroon: text('encrypted_macaroon'),
  encrypted_cert: text('encrypted_cert'),
  created_at: text('created_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  updated_at: text('updated_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
});
