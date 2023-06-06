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
import { ThemeContext } from 'styled-components';
import numeral from 'numeral';
import { timeFormat, timeParse } from 'd3-time-format';

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

interface BarChartProps {
  colorRange: string[];
  data: any;
  yAxisLabel: string;
  title: string;
}

export const BarChartV2 = ({
  data,
  colorRange,
  yAxisLabel,
  title,
}: BarChartProps) => {
  const themeContext = useContext(ThemeContext);

  const seriesData = useMemo(() => {
    if (data.length === 0) return { dates: [], series: [] };

    const series = [
      {
        name: title,
        type: 'bar',
        emphasis: { focus: 'series' },
        data: data.map((d: any) => d.Invoices),
      },
    ];

    const dates = data.map((d: any) => d.date);

    return { dates, series };
  }, [data, title]);

  const option = useMemo(() => {
    const fontColor = themeContext.mode === 'light' ? 'black' : 'white';

    return {
      color: colorRange,
      legend: {
        textStyle: { color: fontColor },
        orient: 'horizontal',
        top: 0,
      },
      title: {
        text: title,
        textStyle: { color: fontColor },
      },
      grid: {
        containLabel: true,
        top: '50px',
        left: '100px',
        bottom: '0px',
        right: '100px',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
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
        name: yAxisLabel,
        nameLocation: 'center',
        nameGap: 48,
        type: 'value',
        axisLine: { show: true, lineStyle: { color: fontColor } },
        splitLine: { show: false },
        axisLabel: {
          formatter: function (value: number) {
            return numeral(value).format('0.0a');
          },
        },
      },
      series: seriesData.series,
    };
  }, [yAxisLabel, colorRange, themeContext, seriesData, title]);

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
