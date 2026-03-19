# Adding a New Lightning Provider

This guide walks through adding a new Lightning implementation (e.g., CLN, Eclair) to ThunderHub.

## Architecture Overview

```
GraphQL Resolvers
       │
       ▼
   NodeService          ← dispatches by account.type
       │
       ▼
ProviderRegistryService ← maps NodeType → LightningProvider
       │
       ├── LndService (type: 'lnd')
       ├── YourService (type: 'your-type')
       └── ...
```

Each provider implements the `LightningProvider` interface from `lightning.types.ts`. The `NodeService` looks up the correct provider for each account via `ProviderRegistryService` and delegates all calls to it. Resolvers never interact with providers directly.

## Steps

### 1. Add the node type constant

In `src/server/modules/node/lightning.types.ts`, add your type to the `NodeType` object:

```ts
export const NodeType = {
  LND: 'lnd',
  YOUR_TYPE: 'your-type',       // ← add this
} as const;
```

### 2. Create the provider directory and service

Create a new directory under `src/server/modules/node/`:

```
src/server/modules/node/your-type/
├── your-type.module.ts
├── your-type.service.ts
└── your-type.helpers.ts     (optional, for error handling etc.)
```

#### `your-type.service.ts`

Your service must implement `LightningProvider`. Use `LndService` (`src/server/modules/node/lnd/lnd.service.ts`) as a reference.

```ts
import { Injectable } from '@nestjs/common';
import EventEmitter from 'events';
import {
  Capability,
  LightningProvider,
  GetChannelsOptions,
  OpenChannelOptions,
  CloseChannelOptions,
  PayOptions,
  CreateInvoiceOptions,
  // ... import all option types you need
} from '../lightning.types';

@Injectable()
export class YourTypeService implements LightningProvider {
  // Return only the capabilities your implementation supports.
  // The UI can query this to hide unsupported features.
  getCapabilities(): Set<Capability> {
    return new Set([
      Capability.WALLET_INFO,
      Capability.CHANNELS,
      Capability.CHAIN,
      Capability.INVOICES,
      Capability.PAYMENTS,
      Capability.PEERS,
      // omit capabilities you don't support
    ]);
  }

  // Create and return a connection object from account config.
  // This is called once at startup per account.
  // The returned object is stored as `account.connection` and passed
  // as the first argument to every other method.
  connect(config: {
    socket: string;
    cert?: string;
    macaroon?: string;
    authToken?: string;
  }): YourConnectionType {
    // e.g., create an axios instance, gRPC client, etc.
    return createYourClient({
      url: config.socket,
      token: config.authToken,
    });
  }

  // Implement each method from the LightningProvider interface.
  // The first parameter is always the connection object returned by connect().
  //
  // For methods your implementation doesn't support, throw an error:
  //
  //   async grantAccess(connection: YourConnectionType): Promise<any> {
  //     throw new Error('grantAccess is not supported by your-type');
  //   }

  async getWalletInfo(connection: YourConnectionType) {
    // Call your node's API and return the result.
    // The return shape should match what the GraphQL resolvers expect.
    // See the LND provider for the expected shapes.
    const info = await connection.getInfo();
    return {
      public_key: info.pubkey,
      alias: info.alias,
      chains: [info.chain],
      // ...
    };
  }

  // ... implement remaining methods
}
```

**Key points about the `connection` parameter:**

- It's the object returned by your `connect()` method
- It can be anything: an axios instance, a gRPC client, a WebSocket connection, etc.
- The `LightningProvider` interface types it as `any` so each provider can use its own connection type
- Within your service, type it concretely (e.g., `connection: AxiosInstance`)

**Key points about return values:**

- Return shapes should match what the existing GraphQL resolvers expect
- Look at the LND provider's return values (which come from the `lightning` npm package) as the reference
- The resolvers access fields like `result.public_key`, `result.channels`, `result.tokens`, etc.
- If your implementation returns data in a different shape, map it in your service

#### `your-type.module.ts`

```ts
import { Module } from '@nestjs/common';
import { YourTypeService } from './your-type.service';

@Module({
  providers: [YourTypeService],
  exports: [YourTypeService],
})
export class YourTypeModule {}
```

### 3. Register the provider

In `src/server/modules/node/provider-registry.service.ts`, inject your service and register it:

```ts
import { Injectable } from '@nestjs/common';
import { LightningProvider, NodeType } from './lightning.types';
import { LndService } from './lnd/lnd.service';
import { YourTypeService } from './your-type/your-type.service';

@Injectable()
export class ProviderRegistryService {
  private providers = new Map<string, LightningProvider>();

  constructor(
    lndService: LndService,
    yourTypeService: YourTypeService,     // ← add this
  ) {
    this.providers.set(NodeType.LND, lndService);
    this.providers.set(NodeType.YOUR_TYPE, yourTypeService);  // ← add this
  }

  // ... rest unchanged
}
```

In `src/server/modules/node/provider-registry.module.ts`, import your module:

```ts
import { Module } from '@nestjs/common';
import { LndModule } from './lnd/lnd.module';
import { YourTypeModule } from './your-type/your-type.module';
import { ProviderRegistryService } from './provider-registry.service';

@Module({
  imports: [LndModule, YourTypeModule],   // ← add YourTypeModule
  providers: [ProviderRegistryService],
  exports: [ProviderRegistryService],
})
export class ProviderRegistryModule {}
```

### 4. Account configuration

Users configure accounts in their YAML config file. Your new type is selected via the `type` field:

```yaml
masterPassword: 'your-password'
accounts:
  - name: 'My Node'
    type: your-type
    serverUrl: 'https://localhost:3001'
    authToken: 'your-auth-token'
    password: 'account-password'
```

The `type` field defaults to `lnd` when omitted, so existing configs are backwards compatible.

Account fields available to all types: `name`, `serverUrl`, `password`, `type`, `authToken`.

LND-specific fields (ignored for other types): `lndDir`, `macaroonPath`, `macaroon`, `certificatePath`, `certificate`, `network`, `encrypted`.

If your implementation needs additional config fields, add them to `AccountType` and `UnresolvedAccountType` in `src/server/modules/files/files.types.ts`, and to `ParsedAccount` if they need to be passed through to the service.

### 5. Subscriptions (optional)

The subscription service (`src/server/modules/sub/sub.service.ts`) currently only supports LND nodes — it filters accounts by `account.type === NodeType.LND`. If your implementation supports event subscriptions, you'll need to:

1. Add subscription methods to the `LightningProvider` interface (or handle them separately)
2. Update `sub.service.ts` to handle your node type

## Full list of LightningProvider methods

These are grouped by capability. If your implementation doesn't support a group, omit those capabilities from `getCapabilities()` and throw in the method bodies.

| Capability | Methods |
|---|---|
| `WALLET_INFO` | `getWalletInfo`, `getIdentity`, `getWalletVersion`, `getHeight` |
| `CHANNELS` | `getChannels`, `getClosedChannels`, `getPendingChannels`, `getChannel`, `openChannel`, `closeChannel`, `getChannelBalance` |
| `CHAIN` | `getChainBalance`, `getPendingChainBalance`, `getChainTransactions`, `getUtxos`, `createChainAddress`, `sendToChainAddress` |
| `PAYMENTS` | `pay`, `payViaPaymentDetails`, `decodePaymentRequest`, `getPayments` |
| `INVOICES` | `createInvoice`, `getInvoices`, `subscribeToInvoice` |
| `PEERS` | `getPeers`, `addPeer`, `removePeer` |
| `FORWARDS` | `getForwards` |
| `BACKUPS` | `getBackups`, `verifyBackup`, `verifyBackups`, `recoverFundsFromChannels` |
| `MACAROONS` | `grantAccess` |
| `SIGN_MESSAGE` | `signMessage`, `verifyMessage` |
| `NETWORK_INFO` | `getNetworkInfo`, `getNode` |
| `ROUTING_FEES` | `updateRoutingFees` |
| `DIFFIE_HELLMAN` | `diffieHellmanComputeSecret` |

## Files you'll touch

| File | Change |
|---|---|
| `src/server/modules/node/lightning.types.ts` | Add to `NodeType` |
| `src/server/modules/node/your-type/your-type.service.ts` | New — implement `LightningProvider` |
| `src/server/modules/node/your-type/your-type.module.ts` | New — NestJS module |
| `src/server/modules/node/provider-registry.service.ts` | Inject and register new service |
| `src/server/modules/node/provider-registry.module.ts` | Import new module |
| `src/server/modules/files/files.types.ts` | Add config fields if needed |

Files you do **not** need to touch: `NodeService`, `AccountsService`, any resolver, any frontend code (for basic support).
