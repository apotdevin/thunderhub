import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie, Shield } from 'lucide-react';
import { CustomMacaroon } from './CustomMacaroon';
import { SuperMacaroon } from './SuperMacaroon';

type BakeryTab = 'custom' | 'super' | null;

export const Bakery = () => {
  const [activeTab, setActiveTab] = useState<BakeryTab>(null);

  const toggle = (tab: BakeryTab) => {
    setActiveTab(prev => (prev === tab ? null : tab));
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Bakery</h2>
      <Card>
        <CardContent>
          <div className="divide-y divide-border">
            <div className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Custom Macaroon</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Bake a macaroon with specific LND permissions
                  </p>
                </div>
                <Button
                  variant={activeTab === 'custom' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggle('custom')}
                >
                  <Cookie size={14} />
                  {activeTab === 'custom' ? 'Close' : 'Bake'}
                </Button>
              </div>
              {activeTab === 'custom' && (
                <div className="mt-4 border-t border-border pt-4">
                  <CustomMacaroon />
                </div>
              )}
            </div>
            <div className="pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Super Macaroon</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    LITD macaroon with full access across all sub-servers
                  </p>
                </div>
                <Button
                  variant={activeTab === 'super' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggle('super')}
                >
                  <Shield size={14} />
                  {activeTab === 'super' ? 'Close' : 'Bake'}
                </Button>
              </div>
              {activeTab === 'super' && (
                <div className="mt-4 border-t border-border pt-4">
                  <SuperMacaroon />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
