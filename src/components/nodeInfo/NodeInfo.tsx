import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_NODE_INFO } from "../../graphql/query";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import { ReactComponent as HelpIcon } from "../../icons/help-circle.svg";
import { ReactComponent as ZapIcon } from "../../icons/zap.svg";
import { ReactComponent as ZapOffIcon } from "../../icons/zap-off.svg";

const Separation = styled.div`
  height: 2px;
  background-color: #e6e6e6;
  width: 100%;
  margin: 20px 0;
`;

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

const Question = styled(HelpIcon)`
  height: 14px;
`;

const Zap = styled(ZapIcon)`
  height: 18px;
  color: ${({ color }: { color?: string }) => (color ? color : "black")};
`;

const ZapOff = styled(ZapOffIcon)`
  height: 18px;
  color: ${({ color }: { color?: string }) => (color ? color : "black")};
`;

export const NodeInfo = () => {
  const { loading, error, data } = useQuery(GET_NODE_INFO);

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
        <Question data-tip={`Version: ${version}`} />
      </Title>
      <Separation />
      <Balance data-tip data-for="balance_tip">
        <Zap color={pendingBalance === 0 ? "#FFD300" : "#652EC7"} />
        {confirmedBalance}
      </Balance>
      <Balance data-tip data-for="chain_balance_tip">
        <ZapOff color={pendingChainBalance === 0 ? "#FFD300" : "#652EC7"} />
        {chainBalance}
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
