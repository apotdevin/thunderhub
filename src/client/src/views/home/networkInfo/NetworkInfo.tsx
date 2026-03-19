import { Globe, Cpu } from 'lucide-react';
import { useGetNetworkInfoQuery } from '../../../graphql/queries/__generated__/getNetworkInfo.generated';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { Price } from '../../../components/price/Price';

const StatItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex justify-between items-center md:flex-col md:items-end md:gap-1">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium font-mono">{children}</span>
  </div>
);

const SectionTitle = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-1.5 pb-3 md:pb-0 md:w-[100px] md:shrink-0">
    <div>{icon}</div>
    <span className="text-sm font-medium text-nowrap">{label}</span>
  </div>
);

export const NetworkInfo = () => {
  const { loading, data, error } = useGetNetworkInfoQuery();

  if (error) {
    return null;
  }

  if (loading || !data || !data.getNetworkInfo) {
    return <LoadingCard title={'Network Info'} />;
  }

  const {
    averageChannelSize,
    channelCount,
    maxChannelSize,
    medianChannelSize,
    minChannelSize,
    nodeCount,
    notRecentlyUpdatedPolicyCount,
    totalCapacity,
  } = data.getNetworkInfo;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Network Info</h2>
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <SectionTitle
              icon={<Globe size={16} className="text-blue-500" />}
              label="Global"
            />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-1">
              <StatItem label="Capacity">
                <Price amount={totalCapacity} breakNumber={true} />
              </StatItem>
              <StatItem label="Channels">{channelCount}</StatItem>
              <StatItem label="Nodes">{nodeCount}</StatItem>
              <StatItem label="Zombie Nodes">
                {notRecentlyUpdatedPolicyCount}
              </StatItem>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <SectionTitle
              icon={<Cpu size={16} className="text-blue-500" />}
              label="Channel Size"
            />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-1">
              <StatItem label="Max">
                <Price amount={maxChannelSize} breakNumber={true} />
              </StatItem>
              <StatItem label="Average">
                <Price amount={averageChannelSize} breakNumber={true} />
              </StatItem>
              <StatItem label="Median">
                <Price amount={medianChannelSize} breakNumber={true} />
              </StatItem>
              <StatItem label="Min">
                <Price amount={minChannelSize} breakNumber={true} />
              </StatItem>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
