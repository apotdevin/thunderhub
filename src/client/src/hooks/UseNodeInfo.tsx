import { useGetNodeInfoQuery } from '../../src/graphql/queries/__generated__/getNodeInfo.generated';
import { getVersion } from '../../src/utils/version';
import { config } from '../config/thunderhubConfig';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const { logoutUrl, basePath } = config;

type StatusState = {
  alias: string;
  color: string;
  syncedToChain: boolean;
  currentBlockHeight: number;
  version: string;
  mayorVersion: number;
  minorVersion: number;
  revision: number;
  activeChannelCount: number;
  pendingChannelCount: number;
  closedChannelCount: number;
  peersCount: number;
  publicKey: string;
  latestBlockHeight?: number | undefined | null;
};

const initialState: StatusState = {
  alias: '',
  color: '',
  syncedToChain: false,
  currentBlockHeight: 0,
  version: '',
  mayorVersion: 0,
  minorVersion: 0,
  revision: 0,
  activeChannelCount: 0,
  pendingChannelCount: 0,
  closedChannelCount: 0,
  peersCount: 0,
  publicKey: '',
};

export const useNodeInfo = (): StatusState => {
  const { data, loading, error } = useGetNodeInfoQuery();

  useEffect(() => {
    if (!error) return;
    toast.error(`Unable to connect to node`);
    window.location.href = logoutUrl || `${basePath}/login`;
  }, [error]);

  if (!data?.getNodeInfo || loading || error) {
    return initialState;
  }

  const {
    alias,
    color,
    is_synced_to_chain,
    version,
    active_channels_count,
    pending_channels_count,
    closed_channels_count,
    peers_count,
    public_key,
    current_block_height,
    latest_block_height,
  } = data.getNodeInfo;

  const { mayor, minor, revision, versionWithPatch } = getVersion(version);

  return {
    alias,
    color,
    syncedToChain: is_synced_to_chain,
    currentBlockHeight: current_block_height || 0,
    version: versionWithPatch,
    mayorVersion: mayor,
    minorVersion: minor,
    revision: revision,
    activeChannelCount: active_channels_count,
    pendingChannelCount: pending_channels_count,
    closedChannelCount: closed_channels_count,
    peersCount: peers_count,
    publicKey: public_key,
    latestBlockHeight: latest_block_height,
  };
};
