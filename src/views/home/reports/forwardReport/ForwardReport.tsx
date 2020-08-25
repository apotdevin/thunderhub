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
import { useGetForwardReportQuery } from 'src/graphql/queries/__generated__/getForwardReport.generated';
import { renderLine } from 'src/components/generic/helpers';
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
import { CardContent } from '.';

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
  isTime: ReportDuration;
  isType: ReportType;
}

const timeMap: { [key: string]: string } = {
  day: 'today',
  week: 'this week',
  month: 'this month',
  quarter_year: 'these three months',
  half_year: 'this half year',
  year: 'this year',
};

export const ForwardReport = ({ isTime, isType }: Props) => {
  const { theme, currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const { data, loading } = useGetForwardReportQuery({
    ssr: false,
    variables: { time: isTime },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!data || loading) {
    return <LoadingCard noCard={true} title={'Forward Report'} />;
  }

  let domain = 24;
  let barWidth = 3;
  if (isTime === 'week') {
    domain = 7;
    barWidth = 15;
  } else if (isTime === 'month') {
    domain = 30;
  } else if (isTime === 'quarter_year') {
    domain = 90;
  } else if (isTime === 'half_year') {
    domain = 180;
    barWidth = 1;
  } else if (isTime === 'year') {
    domain = 360;
    barWidth = 1;
  }

  // Should find a way to avoid JSON.parse
  const parsedData: Array<{ [key in ReportType]: number }> = JSON.parse(
    data.getForwardReport || '[]'
  );

  const getLabelString = (value: number) => {
    if (isType === 'amount') {
      return numeral(value).format('0,0');
    }
    return format({ amount: value });
  };

  const total = getLabelString(
    parsedData.map(x => x[isType]).reduce((a, c) => a + c, 0)
  );

  const renderContent = () => {
    if (parsedData.length <= 0) {
      return (
        <p>{`Your node has not forwarded any payments ${timeMap[isTime]}.`}</p>
      );
    }
    return (
      <>
        <VictoryChart
          height={110}
          padding={{
            top: 20,
            left: isType === 'tokens' ? 80 : 50,
            right: 50,
            bottom: 10,
          }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => `${getLabelString(datum[isType])}`}
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
              isType === 'tokens' ? format({ amount: a, breakNumber: true }) : a
            }
          />
          <VictoryBar
            data={parsedData}
            x="period"
            y={isType}
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
