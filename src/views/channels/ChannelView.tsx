import React from 'react';
import { Channels } from './channels/Channels';
import { PendingChannels } from './pendingChannels/PendingChannels';
import { ClosedChannels } from './closedChannels/ClosedChannels';

export const ChannelView = () => {
    return (
        <>
            <Channels />
            <PendingChannels />
            <ClosedChannels />
        </>
    );
};
