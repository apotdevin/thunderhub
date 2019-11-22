import React, { useContext, useState } from "react";
import { getPercent, getValue } from "../../../helpers/Helpers";
import {
  Progress,
  ProgressBar,
  NodeTitle,
  NodeBar,
  NodeDetails,
  StatusLine,
  DetailLine,
  MainInfo
} from "../Channels.style";
import ReactTooltip from "react-tooltip";
import { SubCard, Separation } from "../../generic/Styled";
import { SettingsContext } from "../../../context/SettingsContext";
import { getStatusDot, getPrivate, getSymbol } from "../helpers";
import { getTransactionLink, getNodeLink } from "../../generic/Helpers";
import Modal from "../../modal/ReactModal";
import { CloseChannel } from "../../closeChannel/CloseChannel";

export const ChannelCard = ({ channelInfo, index }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { price, symbol, currency } = useContext(SettingsContext);
  const priceProps = { price, symbol, currency };

  const getFormat = (amount: string) =>
    getValue({
      amount,
      ...priceProps
    });

  const {
    capacity,
    commitTransactionFee,
    // commitTransactionWeight,
    id,
    isActive,
    isClosing,
    isOpening,
    isPartnerInitiated,
    isPrivate,
    // isStaticRemoteKey,
    localBalance,
    // localReserve,
    partnerPublicKey,
    received,
    remoteBalance,
    // remoteReserve,
    sent,
    // timeOffline,
    // timeOnline,
    transactionId,
    // transactionVout,
    // unsettledBalance,
    partnerNodeInfo
  } = channelInfo;

  const {
    alias,
    // capacity: nodeCapacity,
    // channelCount,
    color: nodeColor
    // lastUpdate
  } = partnerNodeInfo;

  const formatBalance = getFormat(capacity);
  const formatLocal = getFormat(localBalance);
  const formatRemote = getFormat(remoteBalance);
  const formatreceived = getFormat(received);
  const formatSent = getFormat(sent);

  const renderDetails = () => {
    return (
      <>
        <Separation />
        <DetailLine>
          Partner Public Key: {getNodeLink(partnerPublicKey)}
        </DetailLine>
        <DetailLine>
          Transaction Id: {getTransactionLink(transactionId)}
        </DetailLine>
        <DetailLine>Channel Id: {id}</DetailLine>
        <DetailLine>Commit Fee: {getFormat(commitTransactionFee)}</DetailLine>
        {/* <div>{commitTransactionWeight}</div> */}
        {/* <div>{isStaticRemoteKey}</div> */}
        {/* <div>{localReserve}</div> */}
        {/* <div>{remoteReserve}</div> */}
        {/* <div>{timeOffline}</div> */}
        {/* <div>{timeOnline}</div> */}
        {/* <div>{transactionVout}</div> */}
        {/* <div>{unsettledBalance}</div> */}
        {/* <div>{nodeCapacity}</div> */}
        {/* <div>{channelCount}</div> */}
        {/* <div>{lastUpdate}</div> */}
        <Separation />
        <button onClick={() => setModalOpen(true)}>Close Channel</button>
      </>
    );
  };

  return (
    <SubCard color={nodeColor} key={index}>
      <MainInfo onClick={() => setIsOpen(prev => !prev)}>
        <StatusLine>
          {getStatusDot(isActive, "active")}
          {getStatusDot(isOpening, "opening")}
          {getStatusDot(isClosing, "closing")}
        </StatusLine>
        <NodeBar>
          <NodeTitle>{alias ? alias : "Unknown"}</NodeTitle>
          <NodeDetails>
            {formatBalance}
            {getPrivate(isPrivate)}
            {getSymbol(isPartnerInitiated)}
            <div>
              <Progress data-tip data-for={`node_balance_tip_${index}`}>
                <ProgressBar
                  percent={getPercent(localBalance, remoteBalance)}
                />
              </Progress>
              <Progress data-tip data-for={`node_activity_tip_${index}`}>
                <ProgressBar order={2} percent={getPercent(received, sent)} />
              </Progress>
            </div>
          </NodeDetails>
        </NodeBar>
      </MainInfo>
      {isOpen && renderDetails()}
      <ReactTooltip
        id={`node_balance_tip_${index}`}
        effect={"solid"}
        place={"bottom"}
      >
        <div>{`Local Balance: ${formatLocal}`}</div>
        <div>{`Remote Balance: ${formatRemote}`}</div>
      </ReactTooltip>
      <ReactTooltip
        id={`node_activity_tip_${index}`}
        effect={"solid"}
        place={"bottom"}
      >
        <div>{`received: ${formatreceived}`}</div>
        <div>{`Sent: ${formatSent}`}</div>
      </ReactTooltip>
      <Modal isOpen={modalOpen}>
        <CloseChannel setModalOpen={setModalOpen} channelId={id} />
      </Modal>
    </SubCard>
  );
};
