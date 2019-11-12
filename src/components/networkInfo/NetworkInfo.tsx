import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_NETWORK_INFO } from "../../graphql/query";
import { Card } from "../generic/Styled";

export const NetworkInfo = () => {
  const { loading, error, data } = useQuery(GET_NETWORK_INFO);

  console.log(loading, error, data);

  if (loading || !data || !data.getNetworkInfo) {
    return <Card bottom="10px">Loading....</Card>;
  }

  const {
    averageChannelSize,
    channelCount,
    maxChannelSize,
    medianChannelSize,
    minChannelSize,
    nodeCount,
    notRecentlyUpdatedPolicyCount,
    totalCapacity
  } = data.getNetworkInfo;

  return (
    <Card bottom="10px">
      <p>{`Total Capacity: ${totalCapacity}`}</p>
      <p>{`Max Channel Size: ${maxChannelSize}`}</p>
      <p>{`Average Channel Size: ${averageChannelSize}`}</p>
      <p>{`Median Channel Size: ${medianChannelSize}`}</p>
      <p>{`Min Channel Size: ${minChannelSize}`}</p>
      <p>{`Total Channels: ${channelCount}`}</p>
      <p>{`Total Nodes: ${nodeCount}`}</p>
      <p>{`Zombie Nodes: ${notRecentlyUpdatedPolicyCount}`}</p>
    </Card>
  );
};
