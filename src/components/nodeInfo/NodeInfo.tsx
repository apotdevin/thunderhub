import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_NODE_INFO } from "../../graphql/query";
import { Card } from "../generic/Styled";

export const NodeInfo = () => {
  const { loading, error, data } = useQuery(GET_NODE_INFO);

  console.log(loading, error, data);

  if (loading || !data || !data.getNodeInfo) {
    return <Card bottom="10px">Loading....</Card>;
  }

  const {
    color,
    activeChannelsCount,
    isSyncedToChain,
    peersCount,
    pendingChannelsCount,
    version,
    alias
  } = data.getNodeInfo;

  return (
    <Card bottom="10px">
      <p>{`Alias: ${alias}`}</p>
      <p>{`Color: ${color}`}</p>
      <p>{`Version: ${version}`}</p>
      <p>{`Active Channels: ${activeChannelsCount}`}</p>
      <p>{`Pending Channels: ${pendingChannelsCount}`}</p>
      <p>{`Peers: ${peersCount}`}</p>
      <p>{`Synced to chain: ${isSyncedToChain}`}</p>
    </Card>
  );
};
