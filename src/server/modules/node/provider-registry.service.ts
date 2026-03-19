import { Injectable } from '@nestjs/common';
import { LightningProvider, NodeType } from './lightning.types';
import { LndService } from './lnd/lnd.service';
import { LdkServerService } from './ldk-server/ldk-server.service';

@Injectable()
export class ProviderRegistryService {
  private providers = new Map<string, LightningProvider>();

  constructor(
    lndService: LndService,
    ldkServerService: LdkServerService
  ) {
    this.providers.set(NodeType.LND, lndService);
    this.providers.set(NodeType.LDK_SERVER, ldkServerService);
  }

  register(type: string, provider: LightningProvider): void {
    this.providers.set(type, provider);
  }

  getProvider(type: NodeType | string): LightningProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new Error(
        `No lightning provider registered for type "${type}". Available: ${[...this.providers.keys()].join(', ')}`
      );
    }
    return provider;
  }

  hasProvider(type: string): boolean {
    return this.providers.has(type);
  }
}
