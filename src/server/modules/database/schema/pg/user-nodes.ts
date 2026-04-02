import { pgTable, uuid, timestamp, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { nodes } from './nodes';

export const userNodes = pgTable(
  'user_nodes',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id),
    node_id: uuid('node_id')
      .notNull()
      .references(() => nodes.id),
    created_at: timestamp('created_at', { precision: 6, mode: 'string' })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { precision: 6, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  t => [unique().on(t.user_id, t.node_id)]
);
