import { useGetNodeCapabilitiesQuery } from '../graphql/queries/__generated__/getNodeCapabilities.generated';

/**
 * Whether the active node exposes the Taproot Assets capability. Asset features
 * (trading, asset channels, minting, etc.) require it, so this single signal
 * gates both the navigation section and the asset routes — keeping link
 * visibility and route access consistent.
 *
 * Note: this is the node's declared capability. The authoritative check that a
 * tapd daemon is actually reachable lives server-side (`tapdNodeService.getInfo`
 * in `setupTradeCapacity`), which blocks orders from a misconfigured node.
 */
export const useTapdAvailable = (): {
  available: boolean;
  loading: boolean;
} => {
  const { data, loading } = useGetNodeCapabilitiesQuery();
  const available =
    data?.node?.capabilities?.list?.includes('taproot_assets') ?? false;
  return { available, loading };
};
