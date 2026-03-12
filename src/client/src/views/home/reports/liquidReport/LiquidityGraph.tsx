import {
  Card,
  CardWithTitle,
  DarkSubTitle,
  SubTitle,
} from '../../../../components/generic/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { useGetLiquidReportQuery } from '../../../../graphql/queries/__generated__/getChannelReport.generated';
import { chartColors } from '../../../../styles/Themes';
import { HorizontalBarChart } from '../../../../components/chart/HorizontalBarChart';

export const LiquidityGraph = () => {
  const { data, loading } = useGetLiquidReportQuery({ errorPolicy: 'ignore' });

  if (loading) {
    return (
      <CardWithTitle>
        <SubTitle>Liquidity Report</SubTitle>
        <Card mobileCardPadding={'8px 0'}>
          <div className="w-full h-[240px]">
            <div className="flex h-full w-full items-center justify-center">
              <LoadingCard noCard={true} />
            </div>
          </div>
        </Card>
      </CardWithTitle>
    );
  }

  if (!data?.getChannelReport) {
    return (
      <CardWithTitle>
        <SubTitle>Liquidity Report</SubTitle>
        <Card mobileCardPadding={'8px 0'}>
          <div className="w-full h-[240px]">
            <div className="flex h-full w-full items-center justify-center">
              Unable to get liquidity data.
            </div>
          </div>
        </Card>
      </CardWithTitle>
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
      <CardWithTitle>
        <SubTitle>Liquidity Report</SubTitle>
        <Card mobileCardPadding={'8px 0'}>
          <div className="w-full h-[240px]">
            <HorizontalBarChart
              dataKey="Value"
              data={liquidity}
              colorRange={[chartColors.green]}
            />
          </div>
        </Card>
      </CardWithTitle>
      <CardWithTitle>
        <SubTitle>Pending HTLCs</SubTitle>
        <Card mobileCardPadding={'8px 0'}>
          {(totalPendingHtlc || 0) >= 300 && (
            <DarkSubTitle
              className="w-full text-center"
              style={{ color: chartColors.orange }}
            >
              You have a high amount of pending HTLCs. Be careful, a channel can
              hold a maximum of 483.
            </DarkSubTitle>
          )}
          {!totalPendingHtlc ? (
            <DarkSubTitle>
              None of your channels have pending HTLCs
            </DarkSubTitle>
          ) : (
            <div className="w-full h-[240px]">
              <HorizontalBarChart
                dataKey="Value"
                data={htlc}
                colorRange={[chartColors.green]}
              />
            </div>
          )}
        </Card>
      </CardWithTitle>
    </>
  );
};
