import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Layers, GitBranch, Command, Zap } from 'react-feather';
import {
  CardWithTitle,
  SubTitle,
  CardTitle,
  SmallButton,
  Card,
} from '../../../components/generic/Styled';
import {
  unSelectedNavButton,
  cardColor,
  cardBorderColor,
  mediaWidths,
} from '../../../styles/Themes';
import { DecodeCard } from './decode/Decode';
import { SupportCard } from './donate/DonateCard';
import { SupportBar } from './donate/DonateContent';
import { OpenChannel } from './openChannel';
import { LnUrlCard } from './lnurl';
import { LnMarketsCard } from './lnmarkets';
import { AmbossCard } from './amboss/AmbossCard';
import { LightningAddressCard } from './lightningAddress/LightningAddress';

export const QuickCard = styled.div`
  background: ${cardColor};
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid ${cardBorderColor};
  height: 100px;
  flex-grow: 1;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  padding: 10px;
  margin-right: 10px;
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
  justify-content: space-between;
`;

export const MainnetQuickActions = () => {
  const [openCard, setOpenCard] = useState('none');

  const getTitle = () => {
    switch (openCard) {
      case 'decode':
        return 'Decode a Lightning Request';
      case 'open_channel':
        return 'Open a Channel';
      case 'ln_url':
        return 'Use lnurl';
      case 'lightning_address':
        return 'Pay to a Lightning Address';
      default:
        return 'Mainnet Quick Actions';
    }
  };

  const renderContent = () => {
    switch (openCard) {
      case 'support':
        return (
          <Card>
            <SupportBar />
          </Card>
        );
      case 'decode':
        return <DecodeCard />;
      case 'ln_url':
        return <LnUrlCard />;
      case 'lightning_address':
        return <LightningAddressCard />;
      case 'open_channel':
        return (
          <Card>
            <OpenChannel setOpenCard={setOpenCard} />
          </Card>
        );
      default:
        return (
          <QuickRow>
            <SupportCard callback={() => setOpenCard('support')} />
            <AmbossCard />
            <QuickCard onClick={() => setOpenCard('lightning_address')}>
              <Zap size={24} />
              <QuickTitle>Address</QuickTitle>
            </QuickCard>
            <QuickCard onClick={() => setOpenCard('open_channel')}>
              <GitBranch size={24} />
              <QuickTitle>Open</QuickTitle>
            </QuickCard>
            <QuickCard onClick={() => setOpenCard('decode')}>
              <Layers size={24} />
              <QuickTitle>Decode</QuickTitle>
            </QuickCard>
            <QuickCard onClick={() => setOpenCard('ln_url')}>
              <Command size={24} />
              <QuickTitle>LNURL</QuickTitle>
            </QuickCard>
            <LnMarketsCard />
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
