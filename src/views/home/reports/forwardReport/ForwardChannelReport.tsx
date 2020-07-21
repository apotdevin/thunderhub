import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { GitCommit, ArrowDown, ArrowUp } from 'react-feather';
import styled from 'styled-components';
import { useAccountState } from 'src/context/AccountContext';
import { useGetForwardChannelsReportQuery } from 'src/graphql/queries/__generated__/getForwardChannelsReport.generated';
import {
  MultiButton,
  SingleButton,
} from 'src/components/buttons/multiButton/MultiButton';
import { getErrorContent } from '../../../../utils/error';
import {
  DarkSubTitle,
  SingleLine,
} from '../../../../components/generic/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { getPrice } from '../../../../components/price/Price';
import { useConfigState } from '../../../../context/ConfigContext';
import { usePriceState } from '../../../../context/PriceContext';
import { ReportType, ReportDuration } from './ForwardReport';
import { CardContent } from '.';

const ChannelRow = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

type Props = {
  isTime: ReportDuration;
  isType: ReportType;
};

type ParsedRouteType = {
  aliasIn: string;
  aliasOut: string;
  fee: number;
  tokens: number;
  amount: number;
};

type ParsedChannelType = {
  alias: string;
  name: string;
  fee: number;
  tokens: number;
  amount: number;
};

export const ForwardChannelsReport = ({ isTime, isType }: Props) => {
  const [type, setType] = useState<'route' | 'incoming' | 'outgoing'>('route');

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

  // TODO: JSON.parse is really bad... Absolutely no type safety at all
  const parsed: (ParsedChannelType | ParsedRouteType)[] = JSON.parse(
    data.getForwardChannelsReport || '[]'
  );

  const getFormatString = (amount: number | string) => {
    if (typeof amount === 'string') return amount;
    if (isType !== 'amount') {
      return format({ amount });
    }
    return amount;
  };

  const renderRoute = (parsed: ParsedRouteType[]) => {
    const routes = parsed.map((channel: ParsedRouteType, index) => (
      <ChannelRow key={index}>
        <TableLine>{channel.aliasIn}</TableLine>
        <TableLine>{channel.aliasOut}</TableLine>
        <LastTableLine>{getFormatString(channel[isType])}</LastTableLine>
      </ChannelRow>
    ));

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

  const renderChannels = (parsed: ParsedChannelType[]) => {
    const channels = parsed.map((channel: ParsedChannelType, index) => (
      <ChannelRow key={index}>
        <TableLine>{`${channel.alias}`}</TableLine>
        <DarkSubTitle>{`${channel.name}`}</DarkSubTitle>
        <LastTableLine>{getFormatString(channel[isType])}</LastTableLine>
      </ChannelRow>
    ));

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

  const renderContent = (parsed: (ParsedChannelType | ParsedRouteType)[]) => {
    switch (type) {
      case 'route':
        return renderRoute(parsed as ParsedRouteType[]);
      default:
        return renderChannels(parsed as ParsedChannelType[]);
    }
  };

  const renderButtons = () => (
    <MultiButton>
      <SingleButton
        withPadding={'4px 8px'}
        selected={type === 'incoming'}
        onClick={() => setType('incoming')}
      >
        <ArrowDown size={14} />
      </SingleButton>
      <SingleButton
        withPadding={'4px 8px'}
        selected={type === 'route'}
        onClick={() => setType('route')}
      >
        <GitCommit size={14} />
      </SingleButton>
      <SingleButton
        withPadding={'4px 8px'}
        selected={type === 'outgoing'}
        onClick={() => setType('outgoing')}
      >
        <ArrowUp size={14} />
      </SingleButton>
    </MultiButton>
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
