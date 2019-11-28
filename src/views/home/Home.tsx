import React from "react";
import { NetworkInfo } from "../../components/networkInfo/NetworkInfo";
import { ForwardReport } from "../../components/forwardReport/ForwardReport";
import { ForwardChannelsReport } from "../../components/forwardReport/ForwardChannelReport";
import styled from "styled-components";
import { PayCard } from "../../components/pay/pay";
import { CreateInvoiceCard } from "../../components/createInvoice/CreateInvoice";

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
        <PayCard />
      </FirstRow>
      <FirstRow>
        <CreateInvoiceCard />
      </FirstRow>
      <FirstRow>
        <ForwardReport />
        <CenterPadding />
        <ForwardChannelsReport />
      </FirstRow>
      <NetworkInfo />
    </>
  );
};
