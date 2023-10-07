import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { useContext, useMemo } from 'react';
import { ThemeContext } from 'styled-components';
import { LineChart } from 'echarts/charts';
import { Card } from '../generic/Styled';
echarts.use([LineChart]);

type ChannelCartProps = { channelId: string; days: number };

/**
 * lnd currently not support filter for channelId, so now it impossible to optimize query.
 */
export const ChannelCart = ({ channelId, days }: ChannelCartProps) => {
  const themeContext = useContext(ThemeContext);
  const { data } = useGetForwardsQuery({
    ssr: false,
    variables: { days: days },
    onError: error => toast.error(getErrorContent(error)),
  });
  const filteredData = data?.getForwards.filter(
    it => it.incoming_channel === channelId || it.outgoing_channel === channelId
  );
  console.log('santa filteredData', filteredData);

  const xAxisData = (): string[] => {
    if (days === 1) {
      return Array.from(Array(24))
        .map((_, i) => ` ${i} hour ago`)
        .reverse();
    } else {
      return Array.from(Array(days))
        .map((_, i) => ` ${i} days ago`)
        .reverse();
    }
  };

  const option = useMemo(() => {
    const fontColor = themeContext.mode === 'light' ? 'black' : 'white';
    const oppositeColor = themeContext.mode === 'light' ? 'white' : 'black';
    return {
      grid: {
        containLabel: true,
        top: '50px',
        left: '75px',
        bottom: '25px',
        right: '25px',
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'line',
          crossStyle: {
            color: fontColor,
          },
        },
      },
      legend: {
        data: ['Earning', 'Fee', 'Send', 'Received'],
        itemGap: 50,
        textStyle: { color: fontColor },
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData(),
          axisLine: { show: true, lineStyle: { color: fontColor } },
          axisPointer: { show: true, label: { color: oppositeColor } },
        },
      ],
      yAxis: [
        {
          type: 'value',
          position: 'left',
          offset: '100',
          name: 'Earned',
          min: 0,
          max: 250,
          interval: 50,
          axisLine: { show: true, lineStyle: { color: fontColor } },
          axisLabel: {
            formatter: '{value} sats',
          },
          axisPointer: { label: { color: oppositeColor } },
        },
        {
          type: 'value',
          name: 'Fee',
          position: 'left',
          min: 0,
          max: 250,
          interval: 50,
          axisLine: { show: true, lineStyle: { color: fontColor } },
          axisLabel: {
            formatter: '{value} ppm',
          },
          axisPointer: { label: { color: oppositeColor } },
        },
        {
          type: 'value',
          name: 'Amount',
          position: 'right',
          min: 0,
          max: 25,
          interval: 5,
          axisLine: { show: true, lineStyle: { color: fontColor } },
          axisLabel: {
            formatter: '{value} °sats',
          },
          axisPointer: { label: { color: oppositeColor } },
        },
      ],
      series: [
        {
          name: 'Send',
          type: 'bar',
          tooltip: {
            valueFormatter: (value: string) => value + ' sats',
          },
          data: [
            2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
          ],
        },
        {
          name: 'Received',
          type: 'bar',
          tooltip: {
            valueFormatter: (value: string) => value + ' sats',
          },
          data: [
            2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
          ],
        },
        {
          name: 'Fee',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: (value: string) => value + ' ppm',
          },
          data: [
            2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2,
          ],
        },
        {
          name: 'Earning',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: (value: string) => value + ' sats',
          },
          data: [
            3.0, 5.2, 1.3, 4.5, 6.3, 10.2, 15.3, 23.4, 23.0, 10.5, 20.0, 6.2,
          ],
        },
      ],
    };
  }, [themeContext, days]);

  return (
    <Card>
      <ReactEChartsCore
        option={option}
        echarts={echarts}
        notMerge={true}
        lazyUpdate={true}
        showLoading={false}
        style={{ height: '34em' }}
      />
    </Card>
  );
};
