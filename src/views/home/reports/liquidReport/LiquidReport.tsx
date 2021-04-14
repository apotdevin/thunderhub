import React from 'react';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory';
import { useGetLiquidReportQuery } from 'src/graphql/queries/__generated__/getChannelReport.generated';
import { WarningText } from 'src/views/stats/styles';
import {
  CardWithTitle,
  SubTitle,
  Card,
  DarkSubTitle,
} from '../../../../components/generic/Styled';
import { useConfigState } from '../../../../context/ConfigContext';
import {
  chartGridColor,
  chartAxisColor,
  chartColors,
} from '../../../../styles/Themes';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { getPrice } from '../../../../components/price/Price';
import { usePriceState } from '../../../../context/PriceContext';

export const LiquidReport = () => {
  const { theme, currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const { data, loading } = useGetLiquidReportQuery({ ssr: false });

  if (loading) {
    return <LoadingCard title={'Liquidity Report'} />;
  }

  if (!data?.getChannelReport) return null;

  const {
    local,
    remote,
    maxIn,
    maxOut,
    commit,
    totalPendingHtlc,
    outgoingPendingHtlc,
    incomingPendingHtlc,
  } = data.getChannelReport;

  const liquidity = [
    { x: 'Total Commit', y: commit },
    { x: 'Max Outgoing', y: maxOut },
    { x: 'Max Incoming', y: maxIn },
    { x: 'Local Balance', y: local },
    { x: 'Remote Balance', y: remote },
  ];

  const htlc = [
    { x: 'Outgoing', y: outgoingPendingHtlc },
    { x: 'Incoming', y: incomingPendingHtlc },
    { x: 'Total', y: totalPendingHtlc },
  ];

  return (
    <>
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
                labels={({ datum }) =>
                  `${format({ amount: datum.y, noUnit: true })}`
                }
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
              tickFormat={a =>
                `${format({ amount: a, breakNumber: true, noUnit: true })}`
              }
            />
            <VictoryBar
              horizontal
              data={liquidity}
              style={{
                data: {
                  fill: chartColors.green,
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
      <CardWithTitle>
        <SubTitle>Pending HTLCs</SubTitle>
        <Card mobileCardPadding={'8px 0'}>
          {(totalPendingHtlc || 0) >= 300 && (
            <WarningText>
              You have a high amount of pending HTLCs. Be careful, a channel can
              hold a maximum of 483.
            </WarningText>
          )}
          {!totalPendingHtlc && (
            <DarkSubTitle>
              None of your channels have pending HTLCs
            </DarkSubTitle>
          )}
          {!!totalPendingHtlc && (
            <VictoryChart
              height={80}
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
                  labels={({ datum }) => `${datum.y} HTLC`}
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
              />
              <VictoryBar
                horizontal
                data={htlc}
                style={{
                  data: {
                    fill: chartColors.lightblue,
                    width: 10,
                  },
                  labels: {
                    fontSize: 8,
                  },
                }}
              />
            </VictoryChart>
          )}
        </Card>
      </CardWithTitle>
    </>
  );
};
