import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryGroup } from 'victory';
import { useConfigState } from '../../../../context/ConfigContext';
import {
  chartAxisColor,
  chartGridColor,
  flowBarColor,
  flowBarColor2,
} from '../../../../styles/Themes';
import { getPrice } from '../../../../components/price/Price';
import { usePriceState } from '../../../../context/PriceContext';

interface Props {
  isTime: string;
  isType: string;
  parsedData: any[];
  parsedData2: any[];
}

export const FlowReport = ({
  isTime,
  isType,
  parsedData,
  parsedData2,
}: Props) => {
  const { theme, currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  let domain = 24;
  let barWidth = 1;
  if (isTime === 'week') {
    domain = 7;
    barWidth = 15;
  } else if (isTime === 'month') {
    domain = 30;
  } else if (isTime === 'quarter_year') {
    domain = 90;
  } else if (isTime === 'half_year') {
    domain = 180;
  } else if (isTime === 'year') {
    domain = 360;
  }

  return (
    <VictoryChart
      height={100}
      padding={{
        top: 10,
        left: isType === 'tokens' ? 80 : 50,
        right: 50,
        bottom: 10,
      }}
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
      </VictoryGroup>
    </VictoryChart>
  );
};
