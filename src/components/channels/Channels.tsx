import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_CHANNELS } from "../../graphql/query";
import { Card } from "../generic/Styled";

export const Channels = () => {
  const { loading, error, data } = useQuery(GET_CHANNELS);

  console.log(loading, error, data);

  if (loading || !data || !data.getChannels) {
    return <Card bottom="10px">Loading....</Card>;
  }

  const renderChannels = () => {
    return data.getChannels.map((channel: any, index: number) => {
      const {
        capacity,
        commitTransactionFee,
        commitTransactionWeight,
        id,
        isActive,
        isClosing,
        isOpening,
        isPartnerInitiated,
        isPrivate,
        isStaticRemoteKey,
        localBalance,
        localReserve,
        partnerPublicKey,
        recieved,
        remoteBalance,
        remoteReserve,
        sent,
        timeOffline,
        timeOnline,
        transactionId,
        transactionVout,
        unsettledBalance
      } = channel;
      return (
        <Card bottom="10px" key={index}>
          <p>{`Capacity: ${capacity}`}</p>
          <p>{`Local: ${localBalance}`}</p>
          <p>{`Remote: ${remoteBalance}`}</p>
        </Card>
      );
    });
  };

  return renderChannels();
};
