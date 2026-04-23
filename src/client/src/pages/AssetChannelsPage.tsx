import { useState } from 'react';
import { Plus } from 'lucide-react';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { PendingChannels } from '../views/channels/pendingChannels/PendingChannels';
import { ChannelTable } from '../views/channels/channels/ChannelTable';
import { FundAssetChannel } from '../views/assets/FundAssetChannel';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { useNodeSlug, useNodePath } from '../hooks/useNodeSlug';

type AssetChannelTab = 'open' | 'pending';

const tabs: { value: AssetChannelTab; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
];

const tabRoutes: Record<AssetChannelTab, string> = {
  open: '/asset-channels',
  pending: '/asset-channels/pending',
};

const routeToTab = (path: string): AssetChannelTab => {
  if (path === '/asset-channels/pending') return 'pending';
  return 'open';
};

const AssetChannelView = () => {
  const { navigateToNode } = useNodeSlug();
  const nodePath = useNodePath();
  const activeTab = routeToTab(nodePath);

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Asset Channels</h2>

        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={activeTab}
            onValueChange={value => {
              if (value) navigateToNode(tabRoutes[value as AssetChannelTab]);
            }}
          >
            {tabs.map(tab => (
              <ToggleGroupItem key={tab.value} value={tab.value}>
                {tab.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenDialog(true)}
          >
            <Plus className="mr-1 size-4" />
            Open Channel
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          {activeTab === 'open' && (
            <ChannelTable assetOnly storageKey="hiddenColumns-asset-channels" />
          )}
          {activeTab === 'pending' && <PendingChannels assetOnly />}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Open Asset Channel</DialogTitle>
            <DialogDescription>
              Open a new asset channel with a Lightning Network peer.
            </DialogDescription>
          </DialogHeader>
          <FundAssetChannel />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AssetChannelsPage = () => (
  <GridWrapper centerContent={false}>
    <AssetChannelView />
  </GridWrapper>
);

export default AssetChannelsPage;
