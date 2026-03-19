import { useState } from 'react';
import { AssetsList } from './AssetsList';
import { SendAsset } from './SendAsset';
import { ReceiveAsset } from './ReceiveAsset';
import { cn } from '../../lib/utils';

type Tab = 'assets' | 'send' | 'receive';

const tabs: { id: Tab; label: string }[] = [
  { id: 'assets', label: 'Assets' },
  { id: 'send', label: 'Send' },
  { id: 'receive', label: 'Receive' },
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
              'px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'assets' && <AssetsList />}
      {activeTab === 'send' && <SendAsset />}
      {activeTab === 'receive' && <ReceiveAsset />}
    </div>
  );
};
