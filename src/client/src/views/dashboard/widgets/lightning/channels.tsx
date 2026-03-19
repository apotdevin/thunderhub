import { ChannelTable } from '../../../channels/channels/ChannelTable';

export const ChannelListWidget = () => {
  return (
    <div className="h-full w-full overflow-auto">
      <ChannelTable />
    </div>
  );
};
