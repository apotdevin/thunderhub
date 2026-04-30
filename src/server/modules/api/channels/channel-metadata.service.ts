import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE, DrizzleProvider } from '../../database/drizzle.provider';
import { ChannelMetadata } from './channel-metadata.types';

@Injectable()
export class ChannelMetadataService {
  constructor(@Inject(DRIZZLE) private readonly drizzle: DrizzleProvider) {}

  async getNote(
    userId: string,
    nodeId: string,
    channelId: string
  ): Promise<string | null> {
    if (!this.drizzle) return null;
    const { db, schema } = this.drizzle;
    const rows = await (db as any)
      .select({ note: schema.channelMetadata.note })
      .from(schema.channelMetadata)
      .where(
        and(
          eq(schema.channelMetadata.user_id, userId),
          eq(schema.channelMetadata.node_id, nodeId),
          eq(schema.channelMetadata.channel_id, channelId)
        )
      )
      .limit(1);
    return rows[0]?.note ?? null;
  }

  async upsertNote(
    userId: string,
    nodeId: string,
    channelId: string,
    note: string
  ): Promise<ChannelMetadata> {
    if (!this.drizzle) {
      throw new Error(
        'Channel notes require a database. Set DB_TYPE and DB_SQLITE_PATH (or DB_POSTGRES_URL) in your environment.'
      );
    }
    const { db, schema } = this.drizzle;
    const now = new Date().toISOString();
    await (db as any)
      .insert(schema.channelMetadata)
      .values({
        user_id: userId,
        node_id: nodeId,
        channel_id: channelId,
        note,
        updated_at: now,
      })
      .onConflictDoUpdate({
        target: [
          schema.channelMetadata.user_id,
          schema.channelMetadata.node_id,
          schema.channelMetadata.channel_id,
        ],
        set: { note, updated_at: now },
      });
    return { channelId, note, updatedAt: now };
  }
}
