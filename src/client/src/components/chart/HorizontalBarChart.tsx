import { chartColors } from '../../styles/Themes';
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
import { formatSats } from '../../utils/helpers';
import { COMMON_CHART_STYLES } from './common';

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

export const HorizontalBarChart = ({
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
    const themeColor =
      (themeContext as any)?.mode === 'light' ? 'black' : 'white';

    return {
      color: colorRange,
      grid: {
        left: '25px',
        bottom: '25px',
        top: '25px',
        right: '25px',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
        },
        formatter: (params: any) => {
          return `<span style='color: ${
            colorRange[0]
          }; font-weight: bold;'>Value</span><br />
          ${formatSats(params[0].value)}`;
        },
        ...COMMON_CHART_STYLES.tooltip,
      },
      xAxis: {
        max: maxValue * 1.4,
        show: false,
        alignTicks: 'value',
        zIndex: 10,
        z: 10,
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
        max: 4,
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
