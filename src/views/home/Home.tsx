import React from "react";
import { NetworkInfo } from "../../components/networkInfo/NetworkInfo";
import { ForwardReport } from "../../components/forwardReport/ForwardReport";
import { ForwardChannelsReport } from "../../components/forwardReport/ForwardChannelReport";
import styled from "styled-components";

const FirstRow = styled.div`
  display: flex;
`;

const CenterPadding = styled.div`
  width: 20px;
`;

export const Home = () => {
  return (
    <>
      <FirstRow>
        <ForwardReport />
        <CenterPadding />
        <ForwardChannelsReport />
      </FirstRow>
      <NetworkInfo />
    </>
  );
};
