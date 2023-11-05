import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { GitCommit, ArrowDown, ArrowUp } from 'react-feather';
import {
  MultiButton,
  SingleButton,
} from '../../../../components/buttons/multiButton/MultiButton';
import styled from 'styled-components';
import { useGetForwardsQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';
import { getErrorContent } from '../../../../utils/error';
import { SingleLine, SubTitle } from '../../../../components/generic/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { ChannelTable, RouteTable } from './ForwardReportTables';
import { CardContent } from '.';

type Props = {
  days: number;
};

const Spacing = styled.div`
  margin-bottom: 16px;
`;

export const ForwardChannelsReport = ({ days }: Props) => {
  const [type, setType] = useState<'route' | 'incoming' | 'outgoing'>('route');

  const { data, loading } = useGetForwardsQuery({
    ssr: false,
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading) {
    return <LoadingCard noCard={true} title={'Forward Report'} />;
  }

  if (!data?.getForwards.list.length) {
    return null;
  }

  const renderContent = () => {
    if (loading || !data?.getForwards.list.length) return null;
    const { by_incoming, by_outgoing, by_route } = data.getForwards;

    switch (type) {
      case 'route':
        return <RouteTable forwardArray={by_route} />;
      case 'incoming':
        return <ChannelTable forwardArray={by_incoming} />;
      case 'outgoing':
        return <ChannelTable forwardArray={by_outgoing} />;
      default:
        return null;
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

  return (
    <CardContent>
      {renderTitle()}
      {renderContent()}
    </CardContent>
  );
};
