import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Settings } from 'react-feather';
import { ChannelManage } from '../views/channels/channels/ChannelManage';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { useGetNodeInfoQuery } from '../graphql/queries/__generated__/getNodeInfo.generated';
import { PendingChannels } from '../views/channels/pendingChannels/PendingChannels';
import { ClosedChannels } from '../views/channels/closedChannels/ClosedChannels';
import {
  CardWithTitle,
  SubTitle,
  SmallButton,
  Card,
} from '../components/generic/Styled';
import { mediaWidths } from '../styles/Themes';
import { ChannelTable } from '../views/channels/channels/ChannelTable';

export const IconCursor = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 8px;
`;

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

  const { data } = useGetNodeInfoQuery();

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
        return (
          <Card mobileNoBackground={true}>
            <PendingChannels />
          </Card>
        );
      case 3:
        return (
          <Card mobileNoBackground={true}>
            <ClosedChannels />
          </Card>
        );
      default:
        return (
          <Card mobileNoBackground={true}>
            <ChannelTable />
          </Card>
        );
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

const ChannelsPage = () => (
  <GridWrapper centerContent={false}>
    <ChannelView />
  </GridWrapper>
);

export default ChannelsPage;
