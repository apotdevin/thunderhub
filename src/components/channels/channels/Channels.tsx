import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_CHANNELS } from "../../../graphql/query";
import { Card } from "../../generic/Styled";
import { ChannelCard } from "./ChannelCard";

export const Channels = () => {
  const [indexOpen, setIndexOpen] = useState(0);
  const auth = localStorage.getItem("uri");
  const { loading, error, data } = useQuery(GET_CHANNELS, {
    variables: { auth }
  });

  // console.log(loading, error, data);

  if (loading || !data || !data.getChannels) {
    return <Card bottom="10px">Loading....</Card>;
  }

  return (
    <Card>
      <h1 style={{ margin: "0", marginBottom: "10px" }}>Channels</h1>
      {data.getChannels.map((channel: any, index: number) => (
        <>
          <ChannelCard
            channelInfo={channel}
            index={index + 1}
            setIndexOpen={setIndexOpen}
            indexOpen={indexOpen}
          />
        </>
      ))}
    </Card>
  );
};
