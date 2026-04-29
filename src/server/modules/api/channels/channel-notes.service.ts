import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/drizzle.provider';
import { ChannelNote } from './channel-notes.types';

@Injectable()
export class ChannelNotesService {
  constructor(@Inject(DRIZZLE) private readonly drizzle: any) {}

  async getNotes(accountId: string): Promise<ChannelNote[]> {
    if (!this.drizzle) return [];
    const { db, schema } = this.drizzle;
    const rows = await (db as any)
      .select({
        channelId: schema.channelNotes.channel_id,
        note: schema.channelNotes.note,
        updatedAt: schema.channelNotes.updated_at,
      })
      .from(schema.channelNotes)
      .where(eq(schema.channelNotes.account_id, accountId));
    return rows;
  }

  async upsertNote(
    accountId: string,
    channelId: string,
    note: string,
  ): Promise<ChannelNote> {
    if (!this.drizzle) {
      throw new Error(
        'Channel notes require a database. Set DB_TYPE and DB_SQLITE_PATH (or DB_POSTGRES_URL) in your environment.'
      );
    }
    const { db, schema } = this.drizzle;
    const now = new Date().toISOString();
    await (db as any)
      .insert(schema.channelNotes)
      .values({ account_id: accountId, channel_id: channelId, note, updated_at: now })
      .onConflictDoUpdate({
        target: [schema.channelNotes.account_id, schema.channelNotes.channel_id],
        set: { note, updated_at: now },
      });
    return { channelId, note, updatedAt: now };
  }
}
