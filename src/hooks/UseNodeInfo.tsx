import { useGetNodeInfoQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import { useState, useEffect } from 'react';
import { NodeInfoType, ChannelBalanceType } from 'src/graphql/types';

type StatusState = {
  alias: string;
  color: string;
  syncedToChain: boolean;
  version: string;
  mayorVersion: number;
  minorVersion: number;
  revision: number;
  chainBalance: number;
  chainPending: number;
  channelBalance: number;
  channelPending: number;
  activeChannelCount: number;
  pendingChannelCount: number;
  closedChannelCount: number;
  peersCount: number;
};

const initialState = {
  alias: '',
  color: '',
  syncedToChain: false,
  version: '',
  mayorVersion: 0,
  minorVersion: 0,
  revision: 0,
  chainBalance: 0,
  chainPending: 0,
  channelBalance: 0,
  channelPending: 0,
  activeChannelCount: 0,
  pendingChannelCount: 0,
  closedChannelCount: 0,
  peersCount: 0,
};

export const useNodeInfo = (): StatusState => {
  const [nodeInfo, setNodeInfo] = useState<StatusState>(initialState);
  const { data, loading, error } = useGetNodeInfoQuery({
    fetchPolicy: 'cache-only',
  });

  useEffect(() => {
    if (data && !loading && !error) {
      const {
        getChainBalance,
        getPendingChainBalance,
        getChannelBalance,
        getNodeInfo,
      } = data;

      const {
        alias,
        color,
        is_synced_to_chain,
        version,
        active_channels_count,
        pending_channels_count,
        closed_channels_count,
        peers_count,
      } = getNodeInfo as NodeInfoType;
      const {
        confirmedBalance,
        pendingBalance,
      } = getChannelBalance as ChannelBalanceType;

      const versionNumber = version.split(' ');
      const onlyVersion = versionNumber[0].split('-');
      const numbers = onlyVersion[0].split('.');

      setNodeInfo({
        alias,
        color,
        syncedToChain: is_synced_to_chain,
        version: versionNumber[0],
        mayorVersion: Number(numbers[0]),
        minorVersion: Number(numbers[1]),
        revision: Number(numbers[2]),
        chainBalance: getChainBalance || 0,
        chainPending: getPendingChainBalance || 0,
        channelBalance: confirmedBalance,
        channelPending: pendingBalance,
        activeChannelCount: active_channels_count,
        pendingChannelCount: pending_channels_count,
        closedChannelCount: closed_channels_count,
        peersCount: peers_count,
      });
    }
  }, [data, error, loading]);

  return nodeInfo;
};
