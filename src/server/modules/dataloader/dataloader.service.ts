import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { AmbossService } from '../api/amboss/amboss.service';
import { EdgeInfo, NodeAlias } from '../api/amboss/amboss.types';
import { ChannelMetadataService } from '../api/channels/channel-metadata.service';

export type ChannelNoteKey = {
  userId: string;
  nodeId: string;
  channelId: string;
};

export type DataloaderTypes = {
  nodesLoader: DataLoader<string, NodeAlias>;
  edgesLoader: DataLoader<string, EdgeInfo>;
  channelNotesLoader: DataLoader<ChannelNoteKey, string | null>;
};

@Injectable()
export class DataloaderService {
  constructor(
    private ambossService: AmbossService,
    private channelMetadataService: ChannelMetadataService
  ) {}

  createLoaders(): DataloaderTypes {
    const nodesLoader = new DataLoader<string, NodeAlias>(
      async (pubkeys: string[]) => this.ambossService.getNodeAliasBatch(pubkeys)
    );

    const edgesLoader = new DataLoader<string, EdgeInfo>(
      async (ids: string[]) => this.ambossService.getEdgeInfoBatch(ids)
    );

    const channelNotesLoader = new DataLoader<
      ChannelNoteKey,
      string | null,
      string
    >(
      async (keys: readonly ChannelNoteKey[]) => {
        const grouped = new Map<string, ChannelNoteKey[]>();
        for (const key of keys) {
          const groupKey = `${key.userId}:${key.nodeId}`;
          const group = grouped.get(groupKey) || [];
          group.push(key);
          grouped.set(groupKey, group);
        }

        const noteMaps = new Map<string, Map<string, string>>();
        for (const [groupKey, group] of grouped) {
          const { userId, nodeId } = group[0];
          const map = await this.channelMetadataService.getNotesByNode(
            userId,
            nodeId
          );
          noteMaps.set(groupKey, map);
        }

        return keys.map(key => {
          const groupKey = `${key.userId}:${key.nodeId}`;
          return noteMaps.get(groupKey)?.get(key.channelId) ?? null;
        });
      },
      {
        cacheKeyFn: (key: ChannelNoteKey) =>
          `${key.userId}:${key.nodeId}:${key.channelId}`,
      }
    );

    return {
      nodesLoader,
      edgesLoader,
      channelNotesLoader,
    };
  }
}
