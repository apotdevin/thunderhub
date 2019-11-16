import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_CHANNELS } from "../../graphql/query";
import { Card } from "../generic/Styled";
import { getPercent, getValue } from "../../helpers/Helpers";
import {
  Progress,
  ProgressBar,
  NodeTitle,
  NodeBar,
  NodeDetails
} from "./Channels.style";
import { SettingsContext } from "../../context/SettingsContext";
import { DownArrow, UpArrow } from "../generic/Icons";

const getSymbol = (status: boolean) => {
  return status ? <DownArrow /> : <UpArrow />;
};

export const Channels = () => {
  const { loading, error, data } = useQuery(GET_CHANNELS);
  const { price, symbol, currency } = useContext(SettingsContext);
  const priceProps = { price, symbol, currency };

  console.log(loading, error, data);

  if (loading || !data || !data.getChannels) {
    return <Card bottom="10px">Loading....</Card>;
  }

  const renderChannels = () => {
    return data.getChannels.map((channel: any, index: number) => {
      const {
        capacity,
        // commitTransactionFee,
        // commitTransactionWeight,
        // id,
        isActive,
        isClosing,
        isOpening,
        isPartnerInitiated,
        // isPrivate,
        // isStaticRemoteKey,
        localBalance,
        // localReserve,
        // partnerPublicKey,
        recieved,
        remoteBalance,
        // remoteReserve,
        sent,
        // timeOffline,
        // timeOnline,
        // transactionId,
        // transactionVout,
        // unsettledBalance,
        partnerNodeInfo
      } = channel;

      const {
        alias,
        capacity: nodeCapacity,
        // channelCount,
        color: nodeColor
        // lastUpdate
      } = partnerNodeInfo;
      return (
        <Card bottom="10px" color={nodeColor} key={index}>
          <NodeBar>
            <NodeTitle>{alias ? alias : "Unknown"}</NodeTitle>
            <NodeDetails>
              {`Capacity: ${getValue({
                amount: capacity,
                ...priceProps
              })}`}
              {getSymbol(isPartnerInitiated)}
              <div>
                <Progress>
                  <ProgressBar
                    percent={getPercent(localBalance, remoteBalance)}
                  />
                </Progress>
                <Progress>
                  <ProgressBar percent={getPercent(recieved, sent)} />
                </Progress>
              </div>
            </NodeDetails>
          </NodeBar>

          {/* <p>{`${isActive}`}</p> */}
          {/* <p>{`${isClosing}`}</p> */}
          {/* <p>{`${isOpening}`}</p> */}

          {/* <p>{`Node Capacity: ${nodeCapacity}`}</p> */}
          {/* <p>{`Local: ${localBalance}`}</p> */}
          {/* <p>{`Remote: ${remoteBalance}`}</p> */}
          {/* <p>{`${recieved}`}</p> */}
          {/* <p>{`${sent}`}</p> */}
          {/* <p>{`${isPartnerInitiated}`}</p> */}
        </Card>
      );
    });
  };

  return renderChannels();
};
