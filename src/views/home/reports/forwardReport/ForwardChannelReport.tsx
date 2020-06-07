import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { GitCommit, ArrowDown, ArrowUp } from 'react-feather';
import styled, { css } from 'styled-components';
import { useAccountState } from 'src/context/AccountContext';
import { useGetForwardChannelsReportQuery } from 'src/graphql/queries/__generated__/getForwardChannelsReport.generated';
import { getErrorContent } from '../../../../utils/error';
import {
  DarkSubTitle,
  SmallButton,
  SingleLine,
} from '../../../../components/generic/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { getPrice } from '../../../../components/price/Price';
import { useConfigState } from '../../../../context/ConfigContext';
import { usePriceState } from '../../../../context/PriceContext';
import { CardContent } from '.';

const ChannelRow = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonRow = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

type TriButtonProps = {
  selected: boolean;
};

const TriButton = styled(SmallButton)<TriButtonProps>`
  margin: 0;
  border-radius: 0;

  ${({ selected }) =>
    selected &&
    css`
      color: white;
    `}
`;

const LeftButton = styled(TriButton)`
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
`;

const RightButton = styled(TriButton)`
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
`;

const TableLine = styled.div`
  width: 35%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LastTableLine = styled(TableLine)`
  width: auto;
  text-align: right;
`;

interface Props {
  isTime: string;
  isType: string;
  color: string;
}

export const ForwardChannelsReport = ({ isTime, isType, color }: Props) => {
  const [type, setType] = useState('route');

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const { auth } = useAccountState();

  const { data, loading } = useGetForwardChannelsReportQuery({
    skip: !auth,
    variables: { time: isTime, order: isType, auth, type },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!data || loading) {
    return <LoadingCard noCard={true} title={'Forward Report'} />;
  }

  const report = data.getForwardChannelsReport;

  const fillArray = (array: {}[]) => {
    const lengthMissing = 10 - array.length;
    if (lengthMissing === 10) {
      return [];
    }
    if (lengthMissing > 0) {
      for (let i = 0; i < lengthMissing; i += 1) {
        array.push({
          aliasIn: '-',
          aliasOut: '-',
          alias: '-',
          name: '-',
          amount: '',
          fee: '',
          tokens: '',
        });
      }
    }
    return array;
  };

  const parsed = fillArray(JSON.parse(report));

  const getFormatString = (amount: number | string) => {
    if (typeof amount === 'string') return amount;
    if (isType !== 'amount') {
      return format({ amount });
    }
    return amount;
  };

  const renderRoute = (parsed: {}[]) => {
    const routes = parsed.map(
      (channel: { aliasIn: string; aliasOut: string }, index: number) => (
        <ChannelRow key={index}>
          <TableLine>{channel.aliasIn}</TableLine>
          <TableLine>{channel.aliasOut}</TableLine>
          <LastTableLine>{getFormatString(channel[isType])}</LastTableLine>
        </ChannelRow>
      )
    );

    return (
      <>
        <ChannelRow>
          <DarkSubTitle>Incoming</DarkSubTitle>
          <DarkSubTitle>Outgoing</DarkSubTitle>
          <DarkSubTitle></DarkSubTitle>
        </ChannelRow>
        {routes}
      </>
    );
  };

  const renderChannels = (parsed: {}[]) => {
    const channels = parsed.map(
      (channel: { alias: string; name: string }, index: number) => (
        <ChannelRow key={index}>
          <TableLine>{`${channel.alias}`}</TableLine>
          <DarkSubTitle>{`${channel.name}`}</DarkSubTitle>
          <LastTableLine>{getFormatString(channel[isType])}</LastTableLine>
        </ChannelRow>
      )
    );

    return (
      <>
        <ChannelRow>
          <DarkSubTitle>Alias</DarkSubTitle>
          <DarkSubTitle>ID</DarkSubTitle>
          <DarkSubTitle></DarkSubTitle>
        </ChannelRow>
        {channels}
      </>
    );
  };

  const renderContent = (parsed: {}[]) => {
    switch (type) {
      case 'route':
        return renderRoute(parsed);
      default:
        return renderChannels(parsed);
    }
  };

  const renderButtons = () => (
    <ButtonRow>
      <LeftButton
        color={color}
        selected={type === 'incoming'}
        onClick={() => setType('incoming')}
      >
        <ArrowDown size={18} />
      </LeftButton>
      <TriButton
        selected={type === 'route'}
        onClick={() => setType('route')}
        color={color}
      >
        <GitCommit size={18} />
      </TriButton>
      <RightButton
        selected={type === 'outgoing'}
        color={color}
        onClick={() => setType('outgoing')}
      >
        <ArrowUp size={18} />
      </RightButton>
    </ButtonRow>
  );

  const renderTop = (title: string) => (
    <SingleLine>
      <DarkSubTitle>{title}</DarkSubTitle>
      {renderButtons()}
    </SingleLine>
  );

  const renderTitle = () => {
    switch (type) {
      case 'route':
        return renderTop('Routes');
      case 'incoming':
        return renderTop('Incoming');
      default:
        return renderTop('Outgoing');
    }
  };

  if (parsed.length <= 0) {
    return null;
  }

  return (
    <CardContent>
      {renderTitle()}
      {renderContent(parsed)}
    </CardContent>
  );
};
