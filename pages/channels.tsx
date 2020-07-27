import React, { useState, useEffect } from 'react';
import { useGetChannelAmountInfoQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import styled from 'styled-components';
import { Settings } from 'react-feather';
import { IconCursor } from 'src/views/channels/channels/Channel.style';
import { ChannelManage } from 'src/views/channels/channels/ChannelManage';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { withApollo } from 'config/client';
import { Channels } from '../src/views/channels/channels/Channels';
import { PendingChannels } from '../src/views/channels/pendingChannels/PendingChannels';
import { ClosedChannels } from '../src/views/channels/closedChannels/ClosedChannels';
import {
  CardWithTitle,
  SubTitle,
  SmallButton,
} from '../src/components/generic/Styled';
import { mediaWidths } from '../src/styles/Themes';

const ChannelsCardTitle = styled.div`
  display: flex;
  justify-content: space-between;

  @media (${mediaWidths.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ChannelView = () => {
  const [isOpen, isOpenSet] = useState<boolean>(false);
  const [view, setView] = useState<number>(1);
  const [amounts, setAmounts] = useState({
    active: 0,
    pending: 0,
    closed: 0,
  });

  const { data } = useGetChannelAmountInfoQuery();

  useEffect(() => {
    if (data && data.getNodeInfo) {
      const {
        active_channels_count,
        closed_channels_count,
        pending_channels_count,
      } = data.getNodeInfo;

      setAmounts({
        active: active_channels_count,
        pending: pending_channels_count,
        closed: closed_channels_count,
      });
    }
  }, [data]);

  const getView = () => {
    switch (view) {
      case 2:
        return <PendingChannels />;
      case 3:
        return <ClosedChannels />;
      default:
        return <Channels />;
    }
  };

  const getTitle = () => {
    switch (view) {
      case 2:
        return 'Pending Channels';
      case 3:
        return 'Closed Channels';
      default:
        return 'Open Channels';
    }
  };

  return (
    <CardWithTitle>
      <ChannelsCardTitle>
        <SubTitle>{getTitle()}</SubTitle>
        <ButtonRow>
          <SmallButton onClick={() => setView(1)}>
            {`Open (${amounts.active})`}
          </SmallButton>
          <SmallButton onClick={() => setView(2)}>
            {`Pending (${amounts.pending})`}
          </SmallButton>
          <SmallButton onClick={() => setView(3)}>
            {`Closed (${amounts.closed})`}
          </SmallButton>
          {view === 1 && (
            <IconCursor>
              <Settings size={16} onClick={() => isOpenSet(p => !p)} />
            </IconCursor>
          )}
        </ButtonRow>
      </ChannelsCardTitle>
      {view === 1 && isOpen && <ChannelManage />}
      {getView()}
    </CardWithTitle>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <ChannelView />
  </GridWrapper>
);

export default withApollo(Wrapped);
