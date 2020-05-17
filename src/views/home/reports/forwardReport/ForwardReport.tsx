import React from 'react';
import numeral from 'numeral';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryVoronoiContainer,
} from 'victory';
import { toast } from 'react-toastify';
import { useAccountState } from 'src/context/AccountContext';
import { useGetForwardReportQuery } from 'src/graphql/queries/__generated__/getForwardReport.generated';
import {
  chartAxisColor,
  chartBarColor,
  chartGridColor,
} from '../../../../styles/Themes';
import { useConfigState } from '../../../../context/ConfigContext';
import { Sub4Title } from '../../../../components/generic/Styled';
import { getErrorContent } from '../../../../utils/error';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { getPrice } from '../../../../components/price/Price';
import { usePriceState } from '../../../../context/PriceContext';
import { CardContent } from '.';

interface Props {
  isTime: string;
  isType: string;
}

const timeMap: { [key: string]: string } = {
  day: 'today',
  week: 'this week',
  month: 'this month',
};

export const ForwardReport = ({ isTime, isType }: Props) => {
  const { theme, currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const { auth } = useAccountState();

  const { data, loading } = useGetForwardReportQuery({
    skip: !auth,
    variables: { time: isTime, auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!data || loading) {
    return <LoadingCard noCard={true} title={'Forward Report'} />;
  }

  let domain = 24;
  let barWidth = 10;
  if (isTime === 'week') {
    domain = 7;
    barWidth = 15;
  } else if (isTime === 'month') {
    domain = 30;
    barWidth = 5;
  }

  const parsedData: {}[] = JSON.parse(data.getForwardReport);

  const getLabelString = (value: number) => {
    if (isType === 'amount') {
      return numeral(value).format('0,0');
    }
    return format({ amount: value });
  };

  const total = getLabelString(
    parsedData
      .map((x: any) => x[isType])
      .reduce((a: number, c: number) => a + c, 0)
  );

  const renderContent = () => {
    if (parsedData.length <= 0) {
      return (
        <p>{`Your node has not forwarded any payments ${timeMap[isTime]}.`}</p>
      );
    }
    return (
      <>
        <div>
          <VictoryChart
            domainPadding={50}
            padding={{
              top: 30,
              left: isType === 'tokens' ? 100 : 50,
              right: 50,
              bottom: 20,
            }}
            containerComponent={
              <VictoryVoronoiContainer
                voronoiDimension="x"
                labels={({ datum }) => `${getLabelString(datum[isType])}`}
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
                  fontSize: 18,
                },
                grid: { stroke: chartGridColor[theme] },
                axis: { stroke: 'transparent' },
              }}
              tickFormat={a =>
                isType === 'tokens'
                  ? format({ amount: a, breakNumber: true })
                  : a
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
              }}
            />
          </VictoryChart>
        </div>
        <Sub4Title>{`Total: ${total}`}</Sub4Title>
      </>
    );
  };

  return <CardContent>{renderContent()}</CardContent>;
};
