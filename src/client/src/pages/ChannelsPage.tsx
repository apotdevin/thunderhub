import { useState, useEffect } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { useGetNodeInfoQuery } from '../graphql/queries/__generated__/getNodeInfo.generated';
import { PendingChannels } from '../views/channels/pendingChannels/PendingChannels';
import { ClosedChannels } from '../views/channels/closedChannels/ClosedChannels';
import { ChannelTable } from '../views/channels/channels/ChannelTable';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { OpenChannel } from '../views/home/liquidity/OpenChannel';
import { DetailsChange } from '../components/details/detailsChange';
import { useNavigate, useLocation } from 'react-router-dom';

type ChannelTab = 'open' | 'pending' | 'closed';

const tabs: { value: ChannelTab; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'closed', label: 'Closed' },
];

const tabRoutes: Record<ChannelTab, string> = {
  open: '/channels',
  pending: '/channels/pending',
  closed: '/channels/closed',
};

const routeToTab = (pathname: string): ChannelTab => {
  if (pathname === '/channels/pending') return 'pending';
  if (pathname === '/channels/closed') return 'closed';
  return 'open';
};

const ChannelView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = routeToTab(location.pathname);

  const [openDialog, setOpenDialog] = useState<'open' | 'details' | null>(null);
  const [amounts, setAmounts] = useState({
    active: 0,
    pending: 0,
    closed: 0,
  });

  const { data } = useGetNodeInfoQuery();

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

  const counts: Record<ChannelTab, number> = {
    open: amounts.active,
    pending: amounts.pending,
    closed: amounts.closed,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Channels</h2>

        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={activeTab}
            onValueChange={value => {
              if (value) navigate(tabRoutes[value as ChannelTab]);
            }}
          >
            {tabs.map(tab => (
              <ToggleGroupItem key={tab.value} value={tab.value}>
                {tab.label}
                <Badge
                  variant={activeTab === tab.value ? 'default' : 'secondary'}
                  className="min-w-5 justify-center"
                >
                  {counts[tab.value]}
                </Badge>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenDialog('open')}
          >
            <Plus className="mr-1 size-4" />
            Open Channel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenDialog('details')}
          >
            <SlidersHorizontal className="mr-1 size-4" />
            Edit Fees
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          {activeTab === 'open' && <ChannelTable />}
          {activeTab === 'pending' && <PendingChannels />}
          {activeTab === 'closed' && <ClosedChannels />}
        </CardContent>
      </Card>

      <Dialog
        open={openDialog === 'open'}
        onOpenChange={open => !open && setOpenDialog(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Open Channel</DialogTitle>
            <DialogDescription>
              Open a new payment channel with a Lightning Network peer.
            </DialogDescription>
          </DialogHeader>
          <OpenChannel closeCbk={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === 'details'}
        onOpenChange={open => !open && setOpenDialog(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Channel Fees</DialogTitle>
            <DialogDescription>
              Update fee policies across your channels.
            </DialogDescription>
          </DialogHeader>
          <DetailsChange callback={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ChannelsPage = () => (
  <GridWrapper centerContent={false}>
    <ChannelView />
  </GridWrapper>
);

export default ChannelsPage;
