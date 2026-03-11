import { Globe, Cpu } from 'lucide-react';
import { useGetNetworkInfoQuery } from '../../../graphql/queries/__generated__/getNetworkInfo.generated';
import {
  Card,
  CardWithTitle,
  SubTitle,
  SingleLine,
  Separation,
} from '../../../components/generic/Styled';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { Price } from '../../../components/price/Price';
import { cn } from '@/lib/utils';

const Tile = ({
  children,
  className,
  start,
}: {
  children: React.ReactNode;
  className?: string;
  start?: boolean;
}) => (
  <div
    className={cn(
      'flex flex-row justify-between w-full mb-2 mx-0 md:flex-col md:mx-4 md:mb-0 md:w-auto',
      start ? 'items-start' : 'items-end',
      className
    )}
  >
    {children}
  </div>
);

const TileTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm text-muted-foreground mb-0 md:mb-2.5">{children}</div>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-center items-center w-full pb-4 md:justify-start md:pb-0 md:w-[120px]">
    {children}
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

  const capacity = <Price amount={totalCapacity} breakNumber={true} />;
  const maxSize = <Price amount={maxChannelSize} breakNumber={true} />;
  const averageSize = <Price amount={averageChannelSize} breakNumber={true} />;
  const medianSize = <Price amount={medianChannelSize} breakNumber={true} />;
  const minSize = <Price amount={minChannelSize} breakNumber={true} />;

  return (
    <CardWithTitle>
      <SubTitle>Network Info</SubTitle>
      <Card>
        <SingleLine className="flex-wrap">
          <Title>
            <span className="-mb-0.5 mr-0.5">
              <Globe size={18} color={'#2f6fb7'} />
            </span>
            Global
          </Title>
          <Tile>
            <TileTitle>Capacity</TileTitle>
            {capacity}
          </Tile>
          <Tile>
            <TileTitle>Channels</TileTitle>
            {channelCount}
          </Tile>
          <Tile>
            <TileTitle>Nodes</TileTitle>
            {nodeCount}
          </Tile>
          <Tile>
            <TileTitle>Zombie Nodes</TileTitle>
            {notRecentlyUpdatedPolicyCount}
          </Tile>
        </SingleLine>
        <Separation />
        <SingleLine className="flex-wrap">
          <Title>
            <span className="-mb-0.5 mr-0.5">
              <Cpu size={18} color={'#2f6fb7'} />
            </span>
            Channel Size
          </Title>
          <Tile>
            <TileTitle>Max</TileTitle>
            {maxSize}
          </Tile>
          <Tile>
            <TileTitle>Average</TileTitle>
            {averageSize}
          </Tile>
          <Tile>
            <TileTitle>Median</TileTitle>
            {medianSize}
          </Tile>
          <Tile>
            <TileTitle>Min</TileTitle>
            {minSize}
          </Tile>
        </SingleLine>
      </Card>
    </CardWithTitle>
  );
};
