import React, { useState, useContext } from "react";
import {
  Card,
  SubTitle,
  Sub4Title,
  ChartRow,
  ChartLink,
  CardContent,
  ChannelRow,
  CardWithTitle
} from "../generic/Styled";
import { useQuery } from "@apollo/react-hooks";
import { GET_FORWARD_CHANNELS_REPORT } from "../../graphql/query";
import { ButtonRow } from "./Buttons";
import styled from "styled-components";
import { getValue } from "../../helpers/Helpers";
import { SettingsContext } from "../../context/SettingsContext";

export const ForwardChannelsReport = () => {
  const { price, symbol, currency } = useContext(SettingsContext);

  const [isTime, setIsTime] = useState<string>("week");
  const [isType, setIsType] = useState<string>("amount");
  const { data, loading, error } = useQuery(GET_FORWARD_CHANNELS_REPORT, {
    variables: { time: isTime, order: isType }
  });

  if (!data || loading) {
    return (
      <Card>
        <div>Loading</div>
      </Card>
    );
  }

  const parsedIncoming = JSON.parse(data.getForwardChannelsReport.incoming);
  const parsedOutgoing = JSON.parse(data.getForwardChannelsReport.outgoing);

  console.log(parsedIncoming);
  console.log(parsedOutgoing);

  const getFormatString = (amount: number) => {
    if (isType !== "amount") {
      return getValue({ amount, price, symbol, currency });
    }
    return amount;
  };

  const renderContent = () => {
    if (parsedIncoming.length <= 0 || parsedOutgoing.length <= 0) {
      return <p>Your node has not forwarded any payments.</p>;
    }

    return (
      <>
        <Sub4Title>Incoming</Sub4Title>
        {parsedIncoming.map((channel: any, index: number) => (
          <ChannelRow key={index}>
            <div>{channel.name}</div>
            <div>{getFormatString(channel[isType])}</div>
          </ChannelRow>
        ))}
        <Sub4Title>Outgoing</Sub4Title>
        {parsedOutgoing.map((channel: any, index: number) => (
          <ChannelRow key={index}>
            <div>{channel.name}</div>
            <div>{getFormatString(channel[isType])}</div>
          </ChannelRow>
        ))}
        <div style={{ marginTop: "auto" }}>
          <ButtonRow
            isTime={isTime}
            isType={isType}
            setIsTime={setIsTime}
            setIsType={setIsType}
          />
        </div>
      </>
    );
  };

  return (
    <CardWithTitle>
      <SubTitle>Channel Forwards</SubTitle>
      <Card bottom={"10px"} full>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </CardWithTitle>
  );
};
