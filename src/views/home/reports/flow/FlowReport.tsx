import React from 'react';
import numeral from 'numeral';
import { useSettings } from '../../../../context/SettingsContext';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryGroup,
} from 'victory';
import {
  chartAxisColor,
  chartGridColor,
  // chartColors,
  flowBarColor,
  flowBarColor2,
} from '../../../../styles/Themes';
import { getPrice } from '../../../../components/price/Price';
import { usePriceState } from '../../../../context/PriceContext';
// import { WaterfallProps } from '.';

// const beforeMap = {
//     amount: 'amountBefore',
//     tokens: 'tokensBefore',
// };

interface Props {
  isTime: string;
  isType: string;
  // isGraph: string;
  parsedData: {}[];
  parsedData2: {}[];
  // waterfall: WaterfallProps[];
}

export const FlowReport = ({
  isTime,
  isType,
  // isGraph,
  parsedData,
  parsedData2,
}: // waterfall,
Props) => {
  const { theme, currency } = useSettings();
  const priceContext = usePriceState();
  const format = getPrice(currency, priceContext);

  let domain = 24;
  let barWidth = 3;
  if (isTime === 'week') {
    domain = 7;
    barWidth = 15;
  } else if (isTime === 'month') {
    domain = 30;
    barWidth = 3;
  }

  const getLabelString = (value: number) => {
    if (isType === 'amount') {
      return numeral(value).format('0,0');
    }
    return format({ amount: value });
  };

  return (
    <VictoryChart
      height={100}
      domainPadding={50}
      padding={{
        top: 10,
        left: isType === 'tokens' ? 80 : 50,
        right: 50,
        bottom: 10,
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
            fontSize: 8,
          },
          grid: { stroke: chartGridColor[theme] },
          axis: { stroke: 'transparent' },
        }}
        tickFormat={a => (isType === 'tokens' ? format({ amount: a }) : a)}
      />
      <VictoryGroup offset={barWidth}>
        <VictoryBar
          data={parsedData}
          x="period"
          y={isType}
          style={{
            data: {
              fill: flowBarColor[theme],
              width: barWidth,
            },
            labels: {
              fontSize: '12px',
            },
          }}
        />
        <VictoryBar
          data={parsedData2}
          x="period"
          y={isType}
          style={{
            data: {
              fill: flowBarColor2[theme],
              width: barWidth,
            },
            labels: {
              fontSize: '12px',
            },
          }}
        />
        {/* {isGraph === 'graph' && (
                    <VictoryBar
                        data={waterfall}
                        x="period"
                        y={isType}
                        y0={beforeMap[isType]}
                        style={{
                            data: {
                                fill: ({ data, index }: any) => {
                                    console.log(data, index);
                                    return data[index][isType] -
                                        data[index][beforeMap[isType]] >
                                        0
                                        ? chartColors.green
                                        : 'red';
                                },
                                width: barWidth,
                            },
                            labels: {
                                fontSize: '12px',
                            },
                        }}
                    />
                )} */}
      </VictoryGroup>
    </VictoryChart>
  );
};
