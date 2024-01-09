import React, { useState } from 'react';
import styled from 'styled-components';
import {
  X,
  Link,
  CloudLightning,
  FastForward,
  GitPullRequest,
} from 'react-feather';
import {
  CardWithTitle,
  SubTitle,
  CardTitle,
  SmallButton,
} from '../../../components/generic/Styled';
import {
  unSelectedNavButton,
  cardColor,
  cardBorderColor,
  mediaWidths,
} from '../../../styles/Themes';
import { Onchain } from './onchain';
import { RequestChannel } from './request-channel';
import { RefundFaucet } from './refund-faucet';
import { PayInvoice } from './pay-invoice';

export const QuickCard = styled.div`
  background: ${cardColor};
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid ${cardBorderColor};
  height: 100px;
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  color: #69c0ff;

  @media (${mediaWidths.mobile}) {
    padding: 4px;
    height: 80px;
    width: 80px;
  }

  &:hover {
    border: 1px solid #69c0ff;
  }
`;

export const QuickTitle = styled.div`
  font-size: 12px;
  color: ${unSelectedNavButton};
  margin-top: 10px;
  text-align: center;
`;

const QuickRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 32px;
`;

export const FaucetActions = () => {
  const [openCard, setOpenCard] = useState('none');

  const getTitle = () => {
    switch (openCard) {
      case 'refund_faucet':
        return 'Send your unused sats back to the Faucet';
      case 'pay_invoice':
        return 'Pay an invoice with the Faucet';
      case 'request_channel':
        return 'Request a channel from the Faucet';
      case 'onchain':
        return 'Receive onchain sats from the Faucet';
      default:
        return 'Mutinynet Faucet Actions';
    }
  };

  const renderContent = () => {
    switch (openCard) {
      case 'refund_faucet':
        return <RefundFaucet />;
      case 'request_channel':
        return <RequestChannel />;
      case 'onchain':
        return <Onchain />;
      case 'pay_invoice':
        return <PayInvoice />;
      default:
        return (
          <QuickRow>
            <QuickCard onClick={() => setOpenCard('onchain')}>
              <Link size={24} />
              <QuickTitle>Onchain</QuickTitle>
            </QuickCard>
            <QuickCard onClick={() => setOpenCard('pay_invoice')}>
              <CloudLightning size={24} />
              <QuickTitle>Pay Invoice</QuickTitle>
            </QuickCard>
            <QuickCard onClick={() => setOpenCard('refund_faucet')}>
              <FastForward size={24} />
              <QuickTitle>Refund Faucet</QuickTitle>
            </QuickCard>
            <QuickCard onClick={() => setOpenCard('request_channel')}>
              <GitPullRequest size={24} />
              <QuickTitle>Request Channel</QuickTitle>
            </QuickCard>
          </QuickRow>
        );
    }
  };

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>{getTitle()}</SubTitle>
        {openCard !== 'none' && (
          <SmallButton onClick={() => setOpenCard('none')}>
            <X size={18} />
          </SmallButton>
        )}
      </CardTitle>
      {renderContent()}
    </CardWithTitle>
  );
};
