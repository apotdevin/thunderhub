import { useState } from 'react';
import { AssetsList } from './AssetsList';
import { PortfolioDistribution } from './PortfolioDistribution';
import { MintAsset } from './MintAsset';
import { BurnAsset } from './BurnAsset';
import { SendAsset } from './SendAsset';
import { ReceiveAsset } from './ReceiveAsset';
import { AssetTransfers } from './AssetTransfers';
import { FundAssetChannel } from './FundAssetChannel';
import { UniverseManager } from './UniverseManager';
import { TapDaemonInfo } from './TapDaemonInfo';
import { cn } from '../../lib/utils';

type Tab =
  | 'assets'
  | 'send'
  | 'receive'
  | 'channels'
  | 'transfers'
  | 'advanced';

const tabs: { id: Tab; label: string }[] = [
  { id: 'assets', label: 'Assets' },
  { id: 'send', label: 'Send' },
  { id: 'receive', label: 'Receive' },
  { id: 'channels', label: 'Channels' },
  { id: 'transfers', label: 'Transfers' },
  { id: 'advanced', label: 'Advanced' },
];

export const AssetsView = () => {
  const [activeTab, setActiveTab] = useState<Tab>('assets');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Taproot Assets</h2>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'assets' && (
        <div className="flex flex-col gap-4">
          <PortfolioDistribution />
          <AssetsList />
        </div>
      )}
      {activeTab === 'send' && <SendAsset />}
      {activeTab === 'receive' && <ReceiveAsset />}
      {activeTab === 'channels' && <FundAssetChannel />}
      {activeTab === 'transfers' && <AssetTransfers />}
      {activeTab === 'advanced' && (
        <div className="flex flex-col gap-6">
          <MintAsset />
          <div className="h-px bg-border" />
          <BurnAsset />
          <div className="h-px bg-border" />
          <UniverseManager />
          <div className="h-px bg-border" />
          <TapDaemonInfo />
        </div>
      )}
    </div>
  );
};
