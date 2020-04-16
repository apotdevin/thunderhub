import React from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
} from '../../../../components/generic/Styled';
import { useQuery } from '@apollo/react-hooks';
import { useAccount } from '../../../../context/AccountContext';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory';
import { useSettings } from '../../../../context/SettingsContext';
import {
  chartGridColor,
  chartAxisColor,
  liquidityBarColor,
} from '../../../../styles/Themes';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { getPrice } from '../../../../components/price/Price';
import { usePriceState } from '../../../../context/PriceContext';
import { GET_LIQUID_REPORT } from '../../../../graphql/query';

export const LiquidReport = () => {
  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const { theme, currency } = useSettings();
  const priceContext = usePriceState();
  const format = getPrice(currency, priceContext);

  const { data, loading } = useQuery(GET_LIQUID_REPORT, {
    variables: { auth },
  });

  if (loading) {
    return <LoadingCard title={'Liquidity Report'} />;
  }

  if (!data || !data.getChannelReport) {
    return null;
  }

  const { local, remote, maxIn, maxOut } = data.getChannelReport;
  const liquidity = [
    { x: 'Max Outgoing', y: maxOut },
    { x: 'Max Incoming', y: maxIn },
    { x: 'Local Balance', y: local },
    { x: 'Remote Balance', y: remote },
  ];

  return (
    <CardWithTitle>
      <SubTitle>Liquidity Report</SubTitle>
      <Card mobileCardPadding={'8px 0'}>
        <VictoryChart
          height={100}
          domainPadding={10}
          padding={{
            top: 10,
            left: 100,
            right: 50,
            bottom: 20,
          }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => `${format({ amount: datum.y })}`}
              labelComponent={<VictoryTooltip orientation={'left'} />}
            />
          }
        >
          <VictoryAxis
            style={{
              axis: { stroke: chartGridColor[theme] },
              tickLabels: {
                fill: chartAxisColor[theme],
                fontSize: 8,
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: {
                fill: chartAxisColor[theme],
                fontSize: 8,
              },
              grid: { stroke: chartGridColor[theme] },
              axis: { stroke: 'transparent' },
            }}
            tickFormat={a => `${format({ amount: a })}`}
          />
          <VictoryBar
            horizontal
            data={liquidity}
            style={{
              data: {
                fill: liquidityBarColor[theme],
                width: 10,
              },
              labels: {
                fontSize: 8,
              },
            }}
          />
        </VictoryChart>
      </Card>
    </CardWithTitle>
  );
};
