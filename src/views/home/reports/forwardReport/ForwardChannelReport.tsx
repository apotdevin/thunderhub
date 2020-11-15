import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { GitCommit, ArrowDown, ArrowUp } from 'react-feather';
import {
  MultiButton,
  SingleButton,
} from 'src/components/buttons/multiButton/MultiButton';
import { useGetForwardsPastDaysQuery } from 'src/graphql/queries/__generated__/getForwardsPastDays.generated';
import { Forward } from 'src/graphql/types';
import styled from 'styled-components';
import { getErrorContent } from '../../../../utils/error';
import { SingleLine, SubTitle } from '../../../../components/generic/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { ReportType } from './ForwardReport';
import { orderForwardChannels } from './helpers';
import { ChannelTable, RouteTable } from './ForwardReportTables';
import { CardContent } from '.';

type Props = {
  days: number;
  order: ReportType;
};

type ParsedRouteType = {
  route: string;
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

const Spacing = styled.div`
  margin-bottom: 16px;
`;

export const ForwardChannelsReport = ({ days, order }: Props) => {
  const [type, setType] = useState<'route' | 'incoming' | 'outgoing'>('route');

  const { data, loading } = useGetForwardsPastDaysQuery({
    ssr: false,
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!data || loading) {
    return <LoadingCard noCard={true} title={'Forward Report'} />;
  }

  const forwardArray = orderForwardChannels(
    type,
    order,
    data.getForwardsPastDays as Forward[]
  );

  const renderContent = (parsed: (ParsedChannelType | ParsedRouteType)[]) => {
    switch (type) {
      case 'route':
        return (
          <RouteTable
            order={order}
            forwardArray={parsed as ParsedRouteType[]}
          />
        );
      default:
        return (
          <ChannelTable
            order={order}
            forwardArray={parsed as ParsedChannelType[]}
          />
        );
    }
  };

  const renderTop = (title: string) => (
    <Spacing>
      <SingleLine>
        <SubTitle>{title}</SubTitle>
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
      </SingleLine>
    </Spacing>
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

  if (forwardArray.length <= 0) {
    return null;
  }

  return (
    <CardContent>
      {renderTitle()}
      {renderContent(forwardArray)}
    </CardContent>
  );
};
