import React from 'react';
import {
  SubCard,
  SingleLine,
  DarkSubTitle,
  ResponsiveLine,
} from '../../components/generic/Styled';
import { MainInfo } from '../../views/channels/Channels.style';
import { Circle, ChevronRight, XSvg } from '../../components/generic/Icons';
import { getPercent } from '../../utils/Helpers';
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
  const { partner_node_info, local_balance, remote_balance, id } = channel;
  const { alias } = partner_node_info;

  const balancedness = getPercent(remote_balance, local_balance) / 100;
  const formatBalance = numeral(balancedness).format('0,0.00');

  const props = withColor ? { color: themeColors.blue3 } : {};

  return (
    <SubCard key={index} {...props}>
      <MainInfo onClick={() => callback && callback()}>
        <ResponsiveLine withWrap={true}>
          <ChannelLineSection>
            {alias === '' ? `Unknown - ${id}` : `${alias} - ${id}`}
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
                <Circle strokeWidth={'0'} fillcolor={getColor(balancedness)} />
              </CirclePadding>
              {withArrow && <ChevronRight />}
              {closeCallback && (
                <ColorButton onClick={closeCallback}>
                  <XSvg />
                </ColorButton>
              )}
            </SingleLine>
          </ChannelColumnSection>
        </ResponsiveLine>
      </MainInfo>
    </SubCard>
  );
};
