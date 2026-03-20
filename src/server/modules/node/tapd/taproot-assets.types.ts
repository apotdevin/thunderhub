import { TapdRpcApis } from '@lightningpolar/tapd-api';

// ─── Provider interface ─────────────────────────────────────────

export interface TaprootAssetsProvider {
  /** Get the tapd RPC client from a connection object */
  getTapd(connection: any): TapdRpcApis | null;
}

// ─── Helper to check if a provider supports taproot assets ──────

export const isTaprootAssetsProvider = (
  provider: unknown
): provider is TaprootAssetsProvider => {
  return (
    typeof provider === 'object' &&
    provider !== null &&
    'getTapd' in provider &&
    typeof (provider as any).getTapd === 'function'
  );
};
