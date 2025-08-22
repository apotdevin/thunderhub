import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';

import { AmbossService } from '../api/amboss/amboss.service';
import { EdgeInfo, NodeAlias } from '../api/amboss/amboss.types';

export type DataloaderTypes = {
  nodesLoader: DataLoader<string, NodeAlias>;
  edgesLoader: DataLoader<string, EdgeInfo>;
};

@Injectable()
export class DataloaderService {
  constructor(private ambossService: AmbossService) {}

  createLoaders(): DataloaderTypes {
    const nodesLoader = new DataLoader<string, NodeAlias>(
      async (pubkeys: string[]) => this.ambossService.getNodeAliasBatch(pubkeys)
    );

    const edgesLoader = new DataLoader<string, EdgeInfo>(
      async (ids: string[]) => this.ambossService.getEdgeInfoBatch(ids)
    );

    return {
      nodesLoader,
      edgesLoader,
    };
  }
}
