import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_NODE_INFO } from "../../graphql/query";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import { SettingsContext } from "../../context/SettingsContext";
import { getValue } from "../../helpers/Helpers";
import { Separation } from "../generic/Styled";
import { QuestionIcon, Zap, ZapOff } from "../generic/Icons";

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.div`
  font-size: 14px;
  color: #bfbfbf;
  border-bottom: 2px solid
    ${({ bottomColor }: { bottomColor: string }) => bottomColor};
`;

const Balance = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px 0;
  padding: 0 5px;
  cursor: default;
`;

const Alias = styled.div`
  border-bottom: 2px solid
    ${({ bottomColor }: { bottomColor: string }) => bottomColor};
`;

export const NodeInfo = () => {
  const { loading, error, data } = useQuery(GET_NODE_INFO);

  const { price, symbol, currency } = useContext(SettingsContext);
  const priceProps = { price, symbol, currency };

  console.log(loading, error, data);

  if (loading || !data || !data.getNodeInfo) {
    return <div>....</div>;
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

  const chainBalance = data.getChainBalance;
  const pendingChainBalance = data.getPendingChainBalance;
  const { confirmedBalance, pendingBalance } = data.getChannelBalance;

  return (
    <>
      <Title>
        <Alias bottomColor={color}>{alias}</Alias>
        <QuestionIcon data-tip={`Version: ${version}`} />
      </Title>
      <Separation />
      <Balance data-tip data-for="balance_tip">
        <Zap color={pendingBalance === 0 ? "#FFD300" : "#652EC7"} />
        {getValue({ amount: confirmedBalance, ...priceProps })}
      </Balance>
      <Balance data-tip data-for="chain_balance_tip">
        <ZapOff color={pendingChainBalance === 0 ? "#FFD300" : "#652EC7"} />
        {getValue({ amount: chainBalance, ...priceProps })}
      </Balance>
      <Balance
        data-tip
        data-for="node_tip"
      >{`${activeChannelsCount} | ${pendingChannelsCount} | ${peersCount}`}</Balance>
      <Balance>
        <Info bottomColor={isSyncedToChain ? "#95de64" : "#ff7875"}>
          {isSyncedToChain ? "Synced" : "Not Synced"}
        </Info>
      </Balance>
      <Separation />
      <ReactTooltip effect={"solid"} place={"right"} />
      <ReactTooltip id={"balance_tip"} effect={"solid"} place={"right"}>
        <div>{`Channel Balance: ${confirmedBalance}`}</div>
        <div>{`Pending Channel Balance: ${pendingBalance}`}</div>
      </ReactTooltip>
      <ReactTooltip id={"chain_balance_tip"} effect={"solid"} place={"right"}>
        <div>{`Chain Balance: ${chainBalance}`}</div>
        <div>{`Pending Chain Balance: ${pendingChainBalance}`}</div>
      </ReactTooltip>
      <ReactTooltip id={"node_tip"} effect={"solid"} place={"right"}>
        <div>{`Active Channels: ${activeChannelsCount}`}</div>
        <div>{`Pending Channels: ${pendingChannelsCount}`}</div>
        <div>{`Peers: ${peersCount}`}</div>
      </ReactTooltip>
    </>
  );
};
