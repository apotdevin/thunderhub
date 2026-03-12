import { HorizontalBarChart } from '../../../../components/chart/HorizontalBarChart';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { useGetLiquidReportQuery } from '../../../../graphql/queries/__generated__/getChannelReport.generated';
import { useChartColors } from '../../../../lib/chart-colors';

export const LiquidityGraph = () => {
  const chartColors = useChartColors();
  const { data, loading } = useGetLiquidReportQuery({ errorPolicy: 'ignore' });

  if (loading) {
    return (
      <div className="w-full h-full">
        <h4 className="font-black my-2">Liquidity</h4>
        <div className="w-full h-full flex justify-center items-center">
          <LoadingCard noCard={true} />
        </div>
      </div>
    );
  }

  if (!data?.getChannelReport) {
    return (
      <div className="w-full h-full">
        <h4 className="font-black my-2">Liquidity</h4>
        <div className="w-full h-full flex justify-center items-center">
          Unable to get liquidity data.
        </div>
      </div>
    );
  }

  const { local, remote, maxIn, maxOut, commit } = data.getChannelReport;

  const liquidity = [
    { label: 'Total Commit', Value: commit },
    { label: 'Max Outgoing', Value: maxOut },
    { label: 'Max Incoming', Value: maxIn },
    { label: 'Local Balance', Value: local },
    { label: 'Remote Balance', Value: remote },
  ];

  return (
    <div className="w-full h-full">
      <HorizontalBarChart
        data={liquidity}
        colorRange={[chartColors.green]}
        dataKey="Value"
      />
    </div>
  );
};
