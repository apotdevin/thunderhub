import React, { useContext, useState } from "react";
import { getValue } from "../../helpers/Helpers";
import { SettingsContext } from "../../context/SettingsContext";
import { Separation, SubCard } from "../generic/Styled";
import {
  DetailLine,
  StatusLine,
  NodeBar,
  NodeTitle,
  NodeDetails
} from "../channels/Channels.style";
import { getStatusDot, getDateDif, getFormatDate } from "../generic/Helpers";
import styled from "styled-components";

interface InvoiceCardProps {
  invoice: any;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

const DifLine = styled.div`
  font-size: 12px;
  color: #bfbfbf;
`;

const formatDifference = (
  difference: string,
  numDif: number,
  status: boolean
) => {
  if (numDif > 0) {
    return `+ ${difference}`;
  } else if (numDif < 0 && status) {
    return `- ${difference}`;
  } else {
    return null;
  }
};

export const InvoiceCard = ({
  invoice,
  index,
  setIndexOpen,
  indexOpen
}: InvoiceCardProps) => {
  const { price, symbol, currency } = useContext(SettingsContext);
  const priceProps = { price, symbol, currency };

  const getFormat = (amount: string) =>
    getValue({
      amount,
      ...priceProps
    });

  const {
    confirmedAt,
    createdAt,
    description,
    expiresAt,
    isConfirmed,
    received,
    tokens
    // chainAddress,
    // descriptionHash,
    // id,
    // isCanceled,
    // isHeld,
    // isOutgoing,
    // isPrivate,
    // payments,
    // receivedMtokens,
    // request,
    // secret,
  } = invoice;

  const formatAmount = getFormat(tokens);
  const dif = received - tokens;
  const formatDif = getFormat(`${dif}`);

  const handleClick = () => {
    if (indexOpen === index) {
      setIndexOpen(0);
    } else {
      setIndexOpen(index);
    }
  };

  const renderDetails = () => {
    return (
      <>
        <Separation />
        {isConfirmed && (
          <DetailLine>
            <div>Confirmed</div>
            {`${getDateDif(confirmedAt)} ago (${getFormatDate(confirmedAt)})`}
          </DetailLine>
        )}
        <DetailLine>
          <div>Created:</div>
          {`${getDateDif(createdAt)} ago (${getFormatDate(createdAt)})`}
        </DetailLine>
        <DetailLine>
          <div>Expires:</div>
          {`${getDateDif(expiresAt)} ago (${getFormatDate(expiresAt)})`}
        </DetailLine>
        {/* <DetailLine>{chainAddress}</DetailLine> */}
        {/* <DetailLine>{descriptionHash}</DetailLine> */}
        {/* <DetailLine>{isCanceled}</DetailLine> */}
        {/* <DetailLine>{isHeld}</DetailLine> */}
        {/* <DetailLine>{isOutgoing}</DetailLine> */}
        {/* <DetailLine>{isPrivate}</DetailLine> */}
        {/* <DetailLine>{payments}</DetailLine> */}
        {/* <DetailLine>{receivedMtokens}</DetailLine> */}
        {/* <DetailLine>{request}</DetailLine> */}
        {/* <DetailLine>{secret}</DetailLine> */}
      </>
    );
  };

  return (
    <SubCard key={index} onClick={() => handleClick()}>
      <StatusLine>{getStatusDot(isConfirmed, "active")}</StatusLine>
      <NodeBar>
        <NodeTitle>
          {formatAmount}
          <DifLine>{formatDifference(formatDif, dif, isConfirmed)}</DifLine>
        </NodeTitle>
        <NodeDetails>{description}</NodeDetails>
      </NodeBar>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
