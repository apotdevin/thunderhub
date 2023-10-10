import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { useContext, useMemo } from 'react';
import { ThemeContext } from 'styled-components';
import { LineChart } from 'echarts/charts';
import { Card } from '../generic/Styled';
import { chartColors } from '../../styles/Themes';

echarts.use([LineChart]);
const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;
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
  const filteredData = data
    ? data.getForwards.filter(
        it =>
          it.incoming_channel === channelId || it.outgoing_channel === channelId
      )
    : [];

  console.log('santa filteredData', filteredData); //todo remove
  // Helper data
  const fontColor = themeContext.mode === 'light' ? 'black' : 'white';
  const oppositeColor = themeContext.mode === 'light' ? 'white' : 'black';
  const columnSize = days === 1 ? 24 : days;
  const now = new Date();

  // Helper functions
  const calculateColumnIndex = (createdAt: string): number => {
    const diffInHour = Math.floor(
      (now.getTime() - new Date(createdAt).getTime()) / MILLISECONDS_PER_HOUR
    );
    return (
      columnSize - 1 - (days === 1 ? diffInHour : Math.floor(diffInHour / 24))
    );
  };

  const xAxisData = Array.from(Array(columnSize))
    .map((_, i) => (days === 1 ? `${i} hour ago` : `${i} days ago`))
    .reverse();

  const mEarningArr = Array<number>(columnSize).fill(0);
  let feeReceivedArr = Array<number>(columnSize).fill(0);
  const recieveArr = Array<number>(columnSize).fill(0);
  const sendArr = Array<number>(columnSize).fill(0);
  // todo fee count is for out channel or in or both direction? 038c030bb15b8c561e7b 7d check!!!
  // todo fee count is for out channel or in or both direction? 038c030bb15b8c561e7b 7d check!!!
  filteredData.forEach(it => {
    const columnIndex = calculateColumnIndex(it.created_at);
    mEarningArr[columnIndex] += Number.parseInt(it.fee_mtokens);
    if (it.outgoing_channel === channelId) {
      sendArr[columnIndex] += it.tokens;
      feeReceivedArr[columnIndex] +=
        (Number.parseInt(it.fee_mtokens) / it.tokens) * 1000;
    } else {
      recieveArr[columnIndex] += it.tokens;
    }
  });
  //fill zeros with previous non-zero value
  let lastNotZeroValue: number;
  feeReceivedArr = feeReceivedArr.map(Math.round).map(it => {
    if (it !== 0) {
      lastNotZeroValue = it;
    } else if (lastNotZeroValue !== 0) {
      return lastNotZeroValue;
    }
    return it;
  });

  const option = useMemo(() => {
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
      color: [
        chartColors.orange2,
        chartColors.purple,
        chartColors.green,
        chartColors.orange,
        chartColors.lightblue,
      ],
      legend: {
        data: [
          'Earning (received)',
          'Fee (received)',
          'Received',
          'Earning (send)',
          'Send',
        ],
        itemGap: 50,
        textStyle: { color: fontColor },
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
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
          max: Math.floor(Math.max(...mEarningArr) / 1000 + 1),
          // interval: 100,
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
          max: Math.floor(Math.max(...feeReceivedArr) + 1),
          // interval: 50,
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
          max: Math.max(...recieveArr, ...sendArr),
          // interval: 5,
          axisLine: { show: true, lineStyle: { color: fontColor } },
          axisLabel: {
            formatter: '{value} sats',
          },
          axisPointer: { label: { color: oppositeColor } },
        },
      ],
      series: [
        {
          name: 'Earning (received)',
          type: 'line',
          yAxisIndex: 0,
          tooltip: {
            valueFormatter: (value: string) => value + ' sats',
          },
          data: mEarningArr.map(x => x / 1000),
        },
        {
          name: 'Fee (received)',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: (value: string) => value + ' ppm',
          },
          data: feeReceivedArr,
        },
        {
          name: 'Received',
          type: 'bar',
          yAxisIndex: 2,
          tooltip: {
            valueFormatter: (value: string) => value + ' sats',
          },
          data: recieveArr,
        },
        {
          name: 'Earning (send)',
          type: 'line',
          yAxisIndex: 0,
          tooltip: {
            valueFormatter: (value: string) => value + ' sats',
          },
          data: mEarningArr.map(x => x / 1000),
        },
        {
          name: 'Send',
          type: 'bar',
          yAxisIndex: 2,
          tooltip: {
            valueFormatter: (value: string) => value + ' sats',
          },
          data: sendArr,
        },
      ],
    };
  }, [themeContext, days, channelId]);

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
