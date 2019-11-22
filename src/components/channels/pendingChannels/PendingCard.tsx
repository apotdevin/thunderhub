import React, { useContext, useState } from "react";
import { getPercent, getValue } from "../../../helpers/Helpers";
import {
  Progress,
  ProgressBar,
  NodeTitle,
  NodeBar,
  NodeDetails,
  StatusLine,
  DetailLine
} from "../Channels.style";
import ReactTooltip from "react-tooltip";
import { SubCard, Separation } from "../../generic/Styled";
import { SettingsContext } from "../../../context/SettingsContext";
import { getStatusDot, getTooltipType } from "../../generic/Helpers";
import { getNodeLink } from "../../generic/Helpers";

export const PendingCard = ({ channelInfo, index }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const { price, symbol, currency, theme } = useContext(SettingsContext);
  const priceProps = { price, symbol, currency };

  const tooltipType = getTooltipType(theme);

  const getFormat = (amount: string) =>
    getValue({
      amount,
      ...priceProps
    });

  const {
    isActive,
    isClosing,
    isOpening,
    localBalance,
    // localReserve,
    partnerPublicKey,
    received,
    remoteBalance,
    // remoteReserve,
    sent,
    partnerNodeInfo
  } = channelInfo;

  const {
    alias,
    // capacity: nodeCapacity,
    // channelCount,
    color: nodeColor
    // lastUpdate
  } = partnerNodeInfo;

  const formatBalance = getFormat(localBalance + remoteBalance);
  const formatLocal = getFormat(localBalance);
  const formatRemote = getFormat(remoteBalance);
  const formatreceived = getFormat(received);
  const formatSent = getFormat(sent);

  const renderDetails = () => {
    return (
      <>
        <Separation />
        <DetailLine>
          <div>Node Public Key:</div>
          {getNodeLink(partnerPublicKey)}
        </DetailLine>
        {/* <DetailLine>{localReserve}</DetailLine> */}
        {/* <DetailLine>{remoteReserve}</DetailLine> */}
        {/* <DetailLine>{nodeCapacity}</DetailLine> */}
        {/* <DetailLine>{channelCount}</DetailLine> */}
        {/* <DetailLine>{lastUpdate}</DetailLine> */}
      </>
    );
  };

  return (
    <SubCard
      color={nodeColor}
      key={index}
      onClick={() => setIsOpen(prev => !prev)}
    >
      <StatusLine>
        {getStatusDot(isActive, "active")}
        {getStatusDot(isOpening, "opening")}
        {getStatusDot(isClosing, "closing")}
      </StatusLine>
      <NodeBar>
        <NodeTitle>{alias ? alias : "Unknown"}</NodeTitle>
        <NodeDetails>
          {formatBalance}
          <div>
            <Progress data-tip data-for={`node_balance_tip_${index}`}>
              <ProgressBar percent={getPercent(localBalance, remoteBalance)} />
            </Progress>
            <Progress data-tip data-for={`node_activity_tip_${index}`}>
              <ProgressBar order={2} percent={getPercent(received, sent)} />
            </Progress>
          </div>
        </NodeDetails>
      </NodeBar>
      {isOpen && renderDetails()}
      <ReactTooltip
        id={`node_balance_tip_${index}`}
        effect={"solid"}
        place={"bottom"}
        type={tooltipType}
      >
        <div>{`Local Balance: ${formatLocal}`}</div>
        <div>{`Remote Balance: ${formatRemote}`}</div>
      </ReactTooltip>
      <ReactTooltip
        id={`node_activity_tip_${index}`}
        effect={"solid"}
        place={"bottom"}
        type={tooltipType}
      >
        <div>{`received: ${formatreceived}`}</div>
        <div>{`Sent: ${formatSent}`}</div>
      </ReactTooltip>
    </SubCard>
  );
};
