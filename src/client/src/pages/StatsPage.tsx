import { useState } from 'react';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { VolumeStats } from '../views/stats/FlowStats';
import { TimeStats } from '../views/stats/TimeStats';
import { PartnerFeeStats, MyFeeStats } from '../views/stats/FeeStats';
import { StatResume } from '../views/stats/StatResume';
import { StatsProvider } from '../views/stats/context';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type StatsTab = 'flow' | 'uptime' | 'partnerFees' | 'myFees';

const StatsView = () => {
  const [activeTab, setActiveTab] = useState<StatsTab>('flow');

  return (
    <div className="flex flex-col gap-4">
      <StatResume />

      <div className="flex items-center justify-end gap-2">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={activeTab}
          onValueChange={v => v && setActiveTab(v as StatsTab)}
        >
          <ToggleGroupItem value="flow">Flow</ToggleGroupItem>
          <ToggleGroupItem value="uptime">Uptime</ToggleGroupItem>
          <ToggleGroupItem value="partnerFees">Partner Fees</ToggleGroupItem>
          <ToggleGroupItem value="myFees">My Fees</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Card>
        <CardContent>
          {activeTab === 'flow' && <VolumeStats />}
          {activeTab === 'uptime' && <TimeStats />}
          {activeTab === 'partnerFees' && <PartnerFeeStats />}
          {activeTab === 'myFees' && <MyFeeStats />}
        </CardContent>
      </Card>
    </div>
  );
};

const StatsPage = () => (
  <GridWrapper centerContent={false}>
    <StatsProvider>
      <StatsView />
    </StatsProvider>
  </GridWrapper>
);

export default StatsPage;
