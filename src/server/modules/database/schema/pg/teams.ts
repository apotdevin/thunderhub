import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const teams = pgTable('teams', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  created_at: timestamp('created_at', { precision: 6, mode: 'string' })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { precision: 6, mode: 'string' })
    .notNull()
    .defaultNow(),
});
