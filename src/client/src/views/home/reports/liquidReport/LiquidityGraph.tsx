import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { useGetLiquidReportQuery } from '../../../../graphql/queries/__generated__/getChannelReport.generated';
import { useChartColors } from '../../../../lib/chart-colors';
import { HorizontalBarChart } from '../../../../components/chart/HorizontalBarChart';

export const LiquidityGraph = () => {
  const chartColors = useChartColors();
  const { data, loading } = useGetLiquidReportQuery({ errorPolicy: 'ignore' });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liquidity Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[240px] w-full items-center justify-center">
            <LoadingCard noCard={true} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.getChannelReport) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liquidity Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[240px] w-full items-center justify-center text-sm text-muted-foreground">
            Unable to get liquidity data.
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    local,
    remote,
    maxIn,
    maxOut,
    commit,
    outgoingPendingHtlc,
    incomingPendingHtlc,
    totalPendingHtlc,
  } = data.getChannelReport;

  const liquidity = [
    { label: 'Remote Balance', Value: remote },
    { label: 'Local Balance', Value: local },
    { label: 'Max Incoming', Value: maxIn },
    { label: 'Max Outgoing', Value: maxOut },
    { label: 'Total Commit', Value: commit },
  ];

  const htlc = [
    { label: 'Outgoing', Value: outgoingPendingHtlc },
    { label: 'Incoming', Value: incomingPendingHtlc },
    { label: 'Total', Value: totalPendingHtlc },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Liquidity Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full">
            <HorizontalBarChart
              dataKey="Value"
              data={liquidity}
              colorRange={[chartColors.green]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending HTLCs</CardTitle>
        </CardHeader>
        <CardContent>
          {(totalPendingHtlc || 0) >= 300 && (
            <div className="mb-3 flex items-center gap-2 rounded border border-orange-500/30 bg-orange-500/5 p-2 text-xs text-orange-500">
              <AlertTriangle size={14} className="shrink-0" />
              You have a high amount of pending HTLCs. Be careful, a channel can
              hold a maximum of 483.
            </div>
          )}
          {!totalPendingHtlc ? (
            <div className="text-sm text-muted-foreground">
              None of your channels have pending HTLCs
            </div>
          ) : (
            <div className="h-[240px] w-full">
              <HorizontalBarChart
                dataKey="Value"
                data={htlc}
                colorRange={[chartColors.green]}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
