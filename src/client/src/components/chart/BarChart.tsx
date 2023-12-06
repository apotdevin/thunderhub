import { useContext, useMemo } from 'react';
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
import { ThemeContext } from 'styled-components';
import numeral from 'numeral';
import { timeFormat, timeParse } from 'd3-time-format';
import { formatSats } from '../../utils/helpers';
import { COMMON_CHART_STYLES } from './common';

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
  const themeContext = useContext(ThemeContext);

  const seriesData = useMemo(() => {
    if (data.length === 0) return { dates: [], series: [] };

    const series = [
      {
        name: title,
        type: 'bar',
        emphasis: { focus: 'series' },
        data: data.map((d: any) => d[dataKey]),
      },
    ];

    const dates = data.map((d: any) => d.date);

    return { dates, series };
  }, [data, title]);

  const option = useMemo(() => {
    const fontColor = themeContext?.mode === 'light' ? 'black' : 'white';

    return {
      color: colorRange,
      grid: {
        containLabel: true,
        top: '50px',
        left: '25px',
        bottom: '25px',
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
          }; font-weight: bold;'>${title}</span><br />
          ${formatSats(params[0].value)}<br />`;
        },
        ...COMMON_CHART_STYLES.tooltip,
      },
      xAxis: {
        name: 'Dates',
        nameLocation: 'center',
        nameGap: 32,
        type: 'category',
        axisLine: { show: true, lineStyle: { color: fontColor } },
        data: seriesData.dates,
        axisLabel: {
          formatter: function (value: string) {
            const parseDate = timeParse('%Y-%m-%dT%H:%M:%S.%L%Z');
            const formatDate = timeFormat('%b %d');
            return formatDate(parseDate(value) as Date);
          },
        },
      },
      yAxis: {
        nameLocation: 'center',
        nameGap: 48,
        type: 'value',
        minInterval: 1,
        splitLine: { show: false },
        axisLine: { show: true, lineStyle: { color: fontColor } },
        axisTick: { show: true },
        axisLabel: {
          formatter: function (value: number) {
            const format = value < 1000 ? '0a' : '0.0a';
            return numeral(value).format(format);
          },
        },
      },
      series: seriesData.series,
    };
  }, [colorRange, themeContext, seriesData, title]);

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
