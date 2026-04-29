import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const channelNotes = sqliteTable(
  'channel_notes',
  {
    account_id: text('account_id').notNull(),
    channel_id: text('channel_id').notNull(),
    note: text('note').notNull().default(''),
    updated_at: text('updated_at')
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.account_id, t.channel_id] }),
  })
);
