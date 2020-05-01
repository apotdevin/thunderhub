import React from 'react';
import {
  SubCard,
  SingleLine,
  DarkSubTitle,
  ResponsiveLine,
} from '../../components/generic/Styled';
import { MainInfo } from '../../components/generic/CardGeneric';
import { Circle, ChevronRight, X } from 'react-feather';
import { getPercent } from '../../utils/helpers';
import { Price } from '../../components/price/Price';
import { themeColors, chartColors } from '../../styles/Themes';
import {
  ChannelColumnSection,
  Padding,
  ChannelLineSection,
  CirclePadding,
} from './Balance.styled';
import numeral from 'numeral';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';

type BalanceCardProps = {
  index: number;
  channel: any;
  withArrow?: boolean;
  withColor?: boolean;
  callback?: () => void;
  closeCallback?: () => void;
};

const getColor = (balance: number) => {
  const difference = Math.abs(balance * 100 - 50);

  switch (true) {
    case difference <= 5:
      return chartColors.green;
    case difference <= 10:
      return chartColors.darkyellow;
    case difference <= 15:
      return chartColors.orange;
    case difference <= 20:
      return chartColors.orange2;
    default:
      return chartColors.red;
  }
};

export const BalanceCard = ({
  index,
  channel,
  withArrow,
  withColor,
  callback,
  closeCallback,
}: BalanceCardProps) => {
  const {
    partner_node_info,
    local_balance,
    remote_balance,
    id,
    partner_public_key,
  } = channel;
  const { alias } = partner_node_info;

  const balancedness = getPercent(remote_balance, local_balance) / 100;
  const formatBalance = numeral(balancedness).format('0,0.00');

  const props = withColor ? { color: themeColors.blue3 } : {};

  return (
    <SubCard key={index} {...props}>
      <MainInfo onClick={() => callback && callback()}>
        <ResponsiveLine withWrap={true}>
          <ChannelLineSection>
            {alias && alias !== ''
              ? `${alias} - ${id}`
              : `${partner_public_key?.substring(0, 6)} - ${id}`}
          </ChannelLineSection>
          <ChannelColumnSection>
            <SingleLine>
              <Padding>
                <DarkSubTitle>Local</DarkSubTitle>
              </Padding>
              <Padding>
                <Price amount={local_balance} />
              </Padding>
            </SingleLine>
            <SingleLine>
              <DarkSubTitle>Remote</DarkSubTitle>
              <Price amount={remote_balance} />
            </SingleLine>
          </ChannelColumnSection>
          <ChannelColumnSection>
            <SingleLine>
              <Padding>
                <DarkSubTitle>Balance</DarkSubTitle>
              </Padding>
              {formatBalance}
            </SingleLine>
          </ChannelColumnSection>
          <ChannelColumnSection>
            <SingleLine>
              <CirclePadding>
                <Circle
                  size={18}
                  strokeWidth={'0'}
                  fill={getColor(balancedness)}
                />
              </CirclePadding>
              {withArrow && <ChevronRight size={18} />}
              {closeCallback && (
                <ColorButton onClick={closeCallback}>
                  <X size={18} />
                </ColorButton>
              )}
            </SingleLine>
          </ChannelColumnSection>
        </ResponsiveLine>
      </MainInfo>
    </SubCard>
  );
};
