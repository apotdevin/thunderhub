import { pgTable, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const channelNotes = pgTable(
  'channel_notes',
  {
    account_id: text('account_id').notNull(),
    channel_id: text('channel_id').notNull(),
    note: text('note').notNull().default(''),
    updated_at: timestamp('updated_at', { precision: 6, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.account_id, t.channel_id] }),
  })
);
