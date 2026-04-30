import { pgTable, uuid, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { nodes } from './nodes';

export const channelMetadata = pgTable(
  'channel_metadata',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    node_id: uuid('node_id')
      .notNull()
      .references(() => nodes.id, { onDelete: 'cascade' }),
    channel_id: text('channel_id').notNull(),
    note: text('note').notNull(),
    created_at: timestamp('created_at', { precision: 6, mode: 'string' })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { precision: 6, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  t => [unique().on(t.user_id, t.node_id, t.channel_id)]
);
