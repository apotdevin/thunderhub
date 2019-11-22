import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_CHANNELS } from "../../../graphql/query";
import { Card } from "../../generic/Styled";
import { ChannelCard } from "./ChannelCard";

export const Channels = () => {
  const { loading, error, data } = useQuery(GET_CHANNELS);

  // console.log(loading, error, data);

  if (loading || !data || !data.getChannels) {
    return <Card bottom="10px">Loading....</Card>;
  }

  return (
    <Card>
      <h1 style={{ margin: "0" }}>Channels</h1>
      {data.getChannels.map((channel: any, index: number) => (
        <>
          <ChannelCard channelInfo={channel} index={index} />
        </>
      ))}
    </Card>
  );
};
