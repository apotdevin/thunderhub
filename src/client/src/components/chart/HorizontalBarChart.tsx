import { useChartColors, useThemeColors } from '../../lib/chart-colors';
import { useMemo } from 'react';
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

export const HorizontalBarChart = ({
  data = [],
  colorRange,
  dataKey,
}: HorizontalBarChartProps) => {
  const chartColors = useChartColors();
  const { mutedForeground, border } = useThemeColors();
  const effectiveColorRange = colorRange ?? [
    chartColors.green,
    chartColors.orange,
    chartColors.lightblue,
  ];

  const keys = Object.keys(data[0] || {}).filter(d => d !== 'label');

  const maxValue = Math.max(
    ...data.map(d => Math.max(...keys.map(key => Number(d[key]))))
  );

  const seriesData = useMemo(() => {
    if (data.length === 0) return [{ type: 'bar', data: [], barWidth: 20 }];

    return [
      {
        type: 'bar',
        data: data.map((d: any) => d[dataKey]),
        barWidth: 20,
        itemStyle: {
          borderRadius: [0, 3, 3, 0],
        },
        label: {
          show: true,
          position: 'right',
          fontSize: 10,
          color: mutedForeground,
          formatter: (params: any) => formatSats(params.value),
        },
      },
    ];
  }, [data, dataKey, mutedForeground]);

  const yLabels = useMemo(() => {
    if (!data.length) return [];
    return data.map(d => d.label);
  }, [data]);

  const option = useMemo(() => {
    return {
      color: effectiveColorRange,
      grid: {
        left: '8px',
        bottom: '8px',
        top: '8px',
        right: '80px',
        outerBoundsMode: 'same',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(150, 150, 150, 0.05)',
          },
        },
        formatter: (params: any) => {
          return `<span style="font-weight:600">${params[0].name}</span>
            <span style="float:right;margin-left:16px;font-weight:600">${formatSats(params[0].value)}</span>`;
        },
        ...COMMON_CHART_STYLES.tooltip,
      },
      xAxis: {
        max: maxValue * 1.4,
        show: false,
      },
      yAxis: {
        axisPointer: {
          show: true,
          type: 'none',
          triggerTooltip: true,
        },
        axisLine: { show: false },
        axisLabel: {
          color: mutedForeground,
          fontSize: 11,
        },
        axisTick: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            color: border,
            type: 'dashed',
            opacity: 0.3,
          },
        },
        data: yLabels,
        type: 'category',
        inverse: true,
        max: data.length - 1,
      },
      legend: { show: false },
      series: seriesData,
    };
  }, [
    effectiveColorRange,
    mutedForeground,
    border,
    seriesData,
    yLabels,
    maxValue,
    data.length,
  ]);

  if (!keys.length) return null;

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      notMerge={true}
      lazyUpdate={true}
      showLoading={false}
      style={{ height: '100%' }}
    />
  );
};
