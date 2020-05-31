import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Layers, GitBranch } from 'react-feather';
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
} from '../../../styles/Themes';
import { AdminSwitch } from '../../../components/adminSwitch/AdminSwitch';
import { DecodeCard } from './decode/Decode';
import { OpenChannelCard } from './openChannel/OpenChannel';
import { SupportCard } from './donate/DonateCard';
import { SupportBar } from './donate/DonateContent';

const QuickCard = styled.div`
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
  margin-bottom: 25px;
  padding: 10px;
  margin-right: 10px;
  cursor: pointer;
  color: #69c0ff;

  &:hover {
    border: 1px solid #69c0ff;
  }
`;

const QuickTitle = styled.div`
  font-size: 14px;
  color: ${unSelectedNavButton};
  margin-top: 10px;
`;

const QuickRow = styled.div`
  display: flex;
`;

export const QuickActions = () => {
  const [openCard, setOpenCard] = useState('none');

  const getTitle = () => {
    switch (openCard) {
      case 'decode':
        return 'Decode a Lightning Request';
      case 'open_channel':
        return 'Open a Channel';
      default:
        return 'Quick Actions';
    }
  };

  const renderContent = () => {
    switch (openCard) {
      case 'support':
        return <SupportBar />;
      case 'decode':
        return <DecodeCard />;
      case 'open_channel':
        return <OpenChannelCard setOpenCard={setOpenCard} />;
      default:
        return (
          <QuickRow>
            <AdminSwitch>
              <SupportCard callback={() => setOpenCard('support')} />
              <QuickCard onClick={() => setOpenCard('open_channel')}>
                <GitBranch size={24} />
                <QuickTitle>Open</QuickTitle>
              </QuickCard>
            </AdminSwitch>
            <QuickCard onClick={() => setOpenCard('decode')}>
              <Layers size={24} />
              <QuickTitle>Decode</QuickTitle>
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
