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
import { getFormatDate } from '../generic/helpers';
import { formatSats } from '../../utils/helpers';

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
    const fontColor = themeContext.mode === 'light' ? 'black' : 'white';

    return {
      color: colorRange,
      title: {
        text: title,
        textStyle: { color: fontColor },
      },
      grid: {
        containLabel: true,
        top: '50px',
        left: '25px',
        bottom: '0px',
        right: '25px',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
        },
        formatter: (params: any) => {
          return `Date: ${getFormatDate(params[0].axisValue)}<br />
          ${params[0].seriesName}: ${formatSats(params[0].value)}<br />`;
        },
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
            return numeral(value).format('0');
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
      style={{
        height: '100%',
      }}
    />
  );
};
