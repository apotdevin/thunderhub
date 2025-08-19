import styled from 'styled-components';
import {
  CardTitle,
  CardWithTitle,
  SmallButton,
  SubTitle,
} from '../../../components/generic/Styled';
import {
  cardBorderColor,
  cardColor,
  mediaWidths,
  unSelectedNavButton,
} from '../../../styles/Themes';
import { ArrowDownRight, ArrowUpRight, X } from 'react-feather';
import { useState } from 'react';
import { OpenChannel } from './OpenChannel';
import { BuyChannel, GoToMagma } from './BuyChannel';

export const QuickCard = styled.div`
  background: ${cardColor};
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid ${cardBorderColor};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  color: #69c0ff;
  gap: 8px;

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
  font-size: 14px;
  color: ${unSelectedNavButton};
  text-align: center;
`;

const S = {
  row: styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 16px;
    margin-top: 16px;
  `,
};

export const Liquidity = () => {
  const [openCard, setOpenCard] = useState('none');

  const getContent = () => {
    switch (openCard) {
      case 'open':
        return <OpenChannel closeCbk={() => setOpenCard('none')} />;
      case 'buy':
        return <BuyChannel />;
      default:
        return (
          <S.row>
            <QuickCard onClick={() => setOpenCard('open')}>
              <ArrowUpRight size={24} />
              <QuickTitle>Open a Channel</QuickTitle>
            </QuickCard>
            <QuickCard onClick={() => setOpenCard('buy')}>
              <ArrowDownRight size={24} />
              <QuickTitle>Buy Inbound Liquidity</QuickTitle>
            </QuickCard>
          </S.row>
        );
    }
  };

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Liquidity</SubTitle>

        <div style={{ display: 'flex' }}>
          {openCard === 'buy' ? <GoToMagma /> : null}

          {openCard !== 'none' && (
            <SmallButton onClick={() => setOpenCard('none')}>
              <X size={18} />
            </SmallButton>
          )}
        </div>
      </CardTitle>
      {getContent()}
    </CardWithTitle>
  );
};
