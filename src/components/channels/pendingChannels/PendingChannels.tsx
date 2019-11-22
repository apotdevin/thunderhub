import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_PENDING_CHANNELS } from "../../../graphql/query";
import { Card } from "../../generic/Styled";
import { PendingCard } from "./PendingCard";

export const PendingChannels = () => {
  const { loading, error, data } = useQuery(GET_PENDING_CHANNELS);

  // console.log(loading, error, data);

  if (loading || !data || !data.getPendingChannels) {
    return <Card bottom="10px">Loading....</Card>;
  }

  return (
    <Card>
      <h1 style={{ margin: "0", marginBottom: "10px" }}>Pending Channels</h1>
      {data.getPendingChannels.map((channel: any, index: number) => (
        <>
          <PendingCard channelInfo={channel} index={index} />
        </>
      ))}
    </Card>
  );
};
