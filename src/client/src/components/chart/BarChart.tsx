import { useMemo } from 'react';
import { BarChart as EBarChart } from 'echarts/charts';
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
import { timeFormat, timeParse } from 'd3-time-format';
import { formatSats } from '../../utils/helpers';
import { COMMON_CHART_STYLES } from './common';
import { useThemeColors } from '../../lib/chart-colors';

echarts.use([
  EBarChart,
  CanvasRenderer,
  GridComponent,
  TooltipComponent,
  GraphicComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
]);

interface BarChartProps {
  colorRange: string[];
  data: any;
  title: string;
  dataKey: string;
}

export const BarChart = ({
  data,
  colorRange,
  title,
  dataKey,
}: BarChartProps) => {
  const { foreground, mutedForeground, border } = useThemeColors();

  const seriesData = useMemo(() => {
    if (data.length === 0) return { dates: [], series: [] };

    const gradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: colorRange[0] },
      { offset: 1, color: colorRange[1] || colorRange[0] },
    ]);

    const series = [
      {
        name: title,
        type: 'bar',
        emphasis: { focus: 'series' },
        data: data.map((d: any) => d[dataKey]),
        itemStyle: {
          color: gradient,
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 32,
      },
    ];

    const dates = data.map((d: any) => d.date);

    return { dates, series };
  }, [data, title, dataKey]);

  const option = useMemo(() => {
    return {
      color: colorRange,
      grid: {
        containLabel: true,
        top: '16px',
        left: '8px',
        bottom: '8px',
        right: '8px',
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
          const parseDate = timeParse('%Y-%m-%dT%H:%M:%S.%L%Z');
          const formatDate = timeFormat('%b %d, %Y');
          const date = parseDate(params[0].axisValue);
          const dateStr = date ? formatDate(date) : params[0].axisValue;
          return `<div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:4px">${dateStr}</div>
            <span style='color: ${colorRange[0]}; font-weight: 600;'>${title}</span>
            <span style="float:right;margin-left:16px;font-weight:600">${formatSats(params[0].value)}</span>`;
        },
        ...COMMON_CHART_STYLES.tooltip,
      },
      xAxis: {
        type: 'category',
        data: seriesData.dates,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: mutedForeground,
          fontSize: 10,
          formatter: function (value: string) {
            const parseDate = timeParse('%Y-%m-%dT%H:%M:%S.%L%Z');
            const formatDate = timeFormat('%b %d');
            return formatDate(parseDate(value) as Date);
          },
        },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: {
          show: true,
          lineStyle: {
            color: border,
            type: 'dashed',
            opacity: 0.5,
          },
        },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: mutedForeground,
          fontSize: 10,
          formatter: function (value: number) {
            return value.toLocaleString('en-US', {
              notation: 'compact',
              maximumFractionDigits: value < 1000 ? 0 : 1,
            });
          },
        },
      },
      series: seriesData.series,
    };
  }, [colorRange, foreground, mutedForeground, border, seriesData, title]);

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
