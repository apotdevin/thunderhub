import React from 'react';
import numeral from 'numeral';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory';
import { toast } from 'react-toastify';
import { renderLine } from 'src/components/generic/helpers';
import { Forward } from 'src/graphql/types';
import {
  chartAxisColor,
  chartBarColor,
  chartGridColor,
} from '../../../../styles/Themes';
import { useConfigState } from '../../../../context/ConfigContext';
import { getErrorContent } from '../../../../utils/error';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { getPrice } from '../../../../components/price/Price';
import { usePriceState } from '../../../../context/PriceContext';
import { orderAndReducedArray } from './helpers';
import { CardContent } from '.';
import { useGetForwardsQuery } from 'src/graphql/queries/__generated__/getForwards.generated';

export type ReportDuration =
  | 'day'
  | 'week'
  | 'month'
  | 'quarter_year'
  | 'half_year'
  | 'year';
export type ReportType = 'fee' | 'tokens' | 'amount';
export type FlowReportType = 'tokens' | 'amount';

interface Props {
  days: number;
  order: ReportType;
}

export const ForwardReport = ({ days, order }: Props) => {
  const { theme, currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const { data, loading } = useGetForwardsQuery({
    ssr: false,
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!data || loading) {
    return <LoadingCard noCard={true} title={'Forward Report'} />;
  }

  let domain = 24;
  let barWidth = 3;
  if (days === 7) {
    domain = 7;
    barWidth = 15;
  } else if (days === 30) {
    domain = 30;
  } else if (days === 90) {
    domain = 90;
  } else if (days === 180) {
    domain = 180;
    barWidth = 1;
  } else if (days === 360) {
    domain = 360;
    barWidth = 1;
  }

  const getLabelString = (value: number) => {
    if (order === 'amount') {
      return numeral(value).format('0,0');
    }
    return format({ amount: value });
  };

  const reduced = orderAndReducedArray(days, data.getForwards as Forward[]);

  const total = getLabelString(
    reduced.map(x => x[order]).reduce((a, c) => a + c, 0)
  );

  const renderContent = () => {
    if (data.getForwards.length <= 0) {
      return (
        <p>{`Your node has not forwarded any payments in the past ${days} ${
          days > 1 ? 'days' : 'day'
        }.`}</p>
      );
    }
    return (
      <>
        <VictoryChart
          height={110}
          padding={{
            top: 20,
            left: order === 'tokens' ? 80 : 50,
            right: 50,
            bottom: 10,
          }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => `${getLabelString(datum[order])}`}
              labelComponent={<VictoryTooltip orientation={'bottom'} />}
            />
          }
        >
          <VictoryAxis
            domain={[0, domain]}
            tickFormat={() => ''}
            style={{
              axis: { stroke: chartGridColor[theme] },
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
              order === 'tokens' ? format({ amount: a, breakNumber: true }) : a
            }
          />
          <VictoryBar
            data={reduced}
            x="period"
            y={order}
            style={{
              data: {
                fill: chartBarColor[theme],
                width: barWidth,
              },
              labels: {
                fontSize: 8,
              },
            }}
          />
        </VictoryChart>
        {renderLine('Total', total)}
      </>
    );
  };

  return <CardContent>{renderContent()}</CardContent>;
};
