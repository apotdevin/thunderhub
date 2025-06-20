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
import { formatSats } from '../../utils/helpers';

echarts.use([LineChart]);
const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;
type ChannelCartProps = { channelId: string; days: number };
const getMaxHeight = (arr: number[], rounding?: number): number => {
  const max = Math.max(...arr);
  const index = Math.pow(10, rounding || Math.floor(max).toString().length - 1);
  return max - (max % index) + index * 2;
};

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
    ? data.getForwards.list.filter(it =>
        channelId
          ? it.incoming_channel === channelId ||
            it.outgoing_channel === channelId
          : true
      )
    : [];

  // Helper data
  const fontColor = (themeContext as any)?.mode === 'light' ? 'black' : 'white';
  const oppositeColor =
    (themeContext as any)?.mode === 'light' ? 'white' : 'black';
  const columnSize = days === 1 ? 24 : days;
  const now = new Date();

  // Helper functions
  const calculateColumnIndex = (createdAt: string): number => {
    const diffInHour = Math.floor(
      (now.getTime() - new Date(createdAt).getTime()) / MILLISECONDS_PER_HOUR
    );
    const columnIndex =
      columnSize - 1 - (days === 1 ? diffInHour : Math.floor(diffInHour / 24));
    //sometimes tx created before 10 min. FE: current time - createdAt = 24h10m
    return columnIndex < 0 ? 0 : columnIndex;
  };

  const xAxisData = Array.from(Array(columnSize))
    .map((_, i) => (days === 1 ? `${i} hour ago` : `${i} days ago`))
    .reverse();

  const mEarningSendArr = Array<number>(columnSize).fill(0);
  let feeSendArr: Array<any> = Array(columnSize)
    .fill(0)
    .map(() => ({
      sum: 0,
      count: 0,
    }));
  const receiveArr = Array<number>(columnSize).fill(0);
  const sendArr = Array<number>(columnSize).fill(0);
  filteredData.forEach(it => {
    const columnIndex = calculateColumnIndex(it.created_at);
    if (it.outgoing_channel === channelId || channelId === '') {
      mEarningSendArr[columnIndex] += Number.parseInt(it.fee_mtokens) / 1000;
      sendArr[columnIndex] += it.tokens;
      feeSendArr[columnIndex].sum +=
        (Number.parseInt(it.fee_mtokens) / it.tokens) * 1000;
      feeSendArr[columnIndex].count++;
    } else {
      receiveArr[columnIndex] += it.tokens;
    }
  });
  //fill zeros with previous non-zero value
  let lastNotZeroValue = 0;
  feeSendArr = feeSendArr.map(it => {
    const { sum, count } = it;
    if (count !== 0) {
      lastNotZeroValue = sum / count;
    }
    return lastNotZeroValue.toFixed();
  });

  const option = useMemo(() => {
    return {
      grid: {
        containLabel: true,
        top: '50px',
        left: '30px',
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
        chartColors.orange,
        chartColors.lightblue,
        chartColors.green,
      ],
      legend: {
        data: channelId
          ? ['Earning (Send)', 'Fee', 'Received', 'Send']
          : ['Earning (Send)', 'Fee', 'Activity'],
        itemGap: 50,
        textStyle: { color: fontColor },
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisLine: { show: true, lineStyle: { color: fontColor } },
          axisPointer: {
            type: 'shadow',
            show: true,
            label: { color: oppositeColor },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          position: 'left',
          offset: '80',
          name: 'Earned',
          min: 0,
          max: getMaxHeight(mEarningSendArr),
          splitLine: { show: false },
          axisTick: { show: true },
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
          max: getMaxHeight(feeSendArr),
          splitLine: { show: false },
          axisTick: { show: true },
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
          max: getMaxHeight([...receiveArr, ...sendArr]),
          splitLine: { show: false },
          axisTick: { show: true },
          axisLine: { show: true, lineStyle: { color: fontColor } },
          axisLabel: {
            formatter: '{value} sats',
          },
          axisPointer: { label: { color: oppositeColor } },
        },
      ],
      series: [
        {
          name: 'Earning (Send)',
          type: 'line',
          yAxisIndex: 0,
          tooltip: {
            valueFormatter: (value: number) => formatSats(value) + ' sats',
          },
          data: mEarningSendArr.map(it => it.toFixed(3)),
        },
        {
          // updated by send (out) tx
          name: 'Fee',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: (value: number) => formatSats(value) + ' ppm',
          },
          data: feeSendArr,
        },
        channelId
          ? {
              name: 'Received',
              show: false,
              type: 'bar',
              yAxisIndex: 2,
              tooltip: {
                valueFormatter: (value: number) => formatSats(value) + ' sats',
              },
              data: receiveArr,
            }
          : null,
        {
          name: channelId ? 'Send' : 'Activity',
          type: 'bar',
          yAxisIndex: 2,
          tooltip: {
            valueFormatter: (value: number) => formatSats(value) + ' sats',
          },
          data: sendArr,
        },
      ].filter(it => it),
    };
  }, [
    fontColor,
    channelId,
    xAxisData,
    oppositeColor,
    mEarningSendArr,
    feeSendArr,
    receiveArr,
    sendArr,
  ]);

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
