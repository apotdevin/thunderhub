import React from 'react';
import styled from 'styled-components';
import { Globe, Cpu } from 'react-feather';
import { useAccountState } from 'src/context/AccountContext';
import {
  Card,
  CardWithTitle,
  SubTitle,
  SingleLine,
  Separation,
} from '../../../components/generic/Styled';
import { unSelectedNavButton, mediaWidths } from '../../../styles/Themes';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { Price } from '../../../components/price/Price';
import { useGetNetworkInfoQuery } from '../../../generated/graphql';

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 16px;
  align-items: ${({ start }: { start?: boolean }) =>
    start ? 'flex-start' : 'flex-end'};

  @media (${mediaWidths.mobile}) {
    margin: 0 0 8px;
    flex-direction: row;
    width: 100%;
  }
`;

const TileTitle = styled.div`
  font-size: 14px;
  color: ${unSelectedNavButton};
  margin-bottom: 10px;

  @media (${mediaWidths.mobile}) {
    margin-bottom: 0;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 120px;

  @media (${mediaWidths.mobile}) {
    justify-content: center;
    padding-bottom: 16px;
    width: 100%;
  }
`;

const ResponsiveLine = styled(SingleLine)`
  flex-wrap: wrap;
`;

const Padding = styled.span`
  margin-bottom: -2px;
  margin-right: 2px;
`;

export const NetworkInfo = () => {
  const { auth } = useAccountState();

  const { loading, data, error } = useGetNetworkInfoQuery({
    skip: !auth,
    variables: { auth },
  });

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

  const capacity = <Price amount={totalCapacity} />;
  const maxSize = <Price amount={maxChannelSize} />;
  const averageSize = <Price amount={averageChannelSize} />;
  const medianSize = <Price amount={medianChannelSize} />;
  const minSize = <Price amount={minChannelSize} />;

  return (
    <CardWithTitle>
      <SubTitle>Network Info</SubTitle>
      <Card>
        <ResponsiveLine>
          <Title>
            <Padding>
              <Globe size={18} color={'#2f6fb7'} />
            </Padding>
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
        </ResponsiveLine>
        <Separation />
        <ResponsiveLine>
          <Title>
            <Padding>
              <Cpu size={18} color={'#2f6fb7'} />
            </Padding>
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
        </ResponsiveLine>
      </Card>
    </CardWithTitle>
  );
};
