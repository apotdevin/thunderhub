import { chartColors } from '../../../src/styles/Themes';
import { ThemeContext } from 'styled-components';
import { useContext, useMemo } from 'react';
import { BarChart } from 'echarts/charts';
import {
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';

echarts.use([
  BarChart,
  CanvasRenderer,
  GridComponent,
  TooltipComponent,
  GraphicComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
]);

type HorizontalBarChartProps = {
  data: any[];
  dataKey: string;
  colorRange?: string[];
};

const defaultColorRange = [
  chartColors.green,
  chartColors.orange,
  chartColors.lightblue,
];

export const HorizontalBarChartV2 = ({
  data = [],
  colorRange = defaultColorRange,
  dataKey,
}: HorizontalBarChartProps) => {
  const themeContext = useContext(ThemeContext);

  const keys = Object.keys(data[0] || {}).filter(d => d !== 'label');

  const maxValue = Math.max(
    ...data.map(d => Math.max(...keys.map(key => Number(d[key]))))
  );

  const seriesData = useMemo(() => {
    if (data.length === 0) return [{ type: 'bar', data: [], barWidth: 25 }];

    return [
      {
        type: 'bar',
        data: data.map((d: any) => d[dataKey]),
        barWidth: '25',
      },
    ];
  }, [data, dataKey]);

  const yLabels = useMemo(() => {
    if (!data.length) return [];
    return data.map(d => d.label);
  }, [data]);

  const option = useMemo(() => {
    const themeColor = themeContext.mode === 'light' ? 'black' : 'white';

    return {
      color: colorRange,
      grid: {
        left: '25px',
        bottom: '0px',
        right: '25px',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
        },
      },
      xAxis: {
        max: maxValue * 1.2,
        show: false,
      },
      yAxis: {
        axisPointer: {
          show: true,
          type: 'none',
          triggerTooltip: true,
        },
        lineStyle: {
          color: themeColor,
          type: 'solid',
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: themeColor,
            type: 'solid',
          },
        },
        axisLabel: {
          inside: true,
          interval: 'auto',
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          interval: 'auto',
          inside: true,
        },
        data: yLabels,
        type: 'category',
        inverse: true,
        max: 5,
        position: 'right',
      },
      legend: { show: true },
      series: seriesData,
    };
  }, [colorRange, themeContext, seriesData, yLabels]);

  if (!keys.length) return null;

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        showLoading={false}
        style={{ height: '100%' }}
      />
    </div>
  );
};
