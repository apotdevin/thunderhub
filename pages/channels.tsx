import React, { useState, useEffect } from 'react';
import { Channels } from '../src/views/channels/channels/Channels';
import { PendingChannels } from '../src/views/channels/pendingChannels/PendingChannels';
import { ClosedChannels } from '../src/views/channels/closedChannels/ClosedChannels';
import {
  CardWithTitle,
  SubTitle,
  CardTitle,
  SingleLine,
  ColorButton,
} from '../src/components/generic/Styled';
import { useAccount } from '../src/context/AccountContext';
import { useSettings } from '../src/context/SettingsContext';
import { textColorMap } from '../src/styles/Themes';
import { useGetChannelAmountInfoQuery } from '../src/generated/graphql';

const ChannelView = () => {
  const [view, setView] = useState<number>(1);
  const [amounts, setAmounts] = useState({
    active: 0,
    pending: 0,
    closed: 0,
  });

  const { theme } = useSettings();
  const { auth } = useAccount();

  const { data } = useGetChannelAmountInfoQuery({
    skip: !auth,
    variables: { auth },
  });

  useEffect(() => {
    if (data?.getNodeInfo) {
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
      <CardTitle>
        <SubTitle>{getTitle()}</SubTitle>
        <SingleLine>
          <ColorButton color={textColorMap[theme]} onClick={() => setView(1)}>
            {`Open (${amounts.active})`}
          </ColorButton>
          <ColorButton color={textColorMap[theme]} onClick={() => setView(2)}>
            {`Pending (${amounts.pending})`}
          </ColorButton>
          <ColorButton color={textColorMap[theme]} onClick={() => setView(3)}>
            {`Closed (${amounts.closed})`}
          </ColorButton>
        </SingleLine>
      </CardTitle>
      {getView()}
    </CardWithTitle>
  );
};

export default ChannelView;
