import { HorizontalBarChart } from '../../../../components/chart/HorizontalBarChart';
import {
  Card,
  CardWithTitle,
  DarkSubTitle,
  SubTitle,
} from '../../../../components/generic/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { useGetLiquidReportQuery } from '../../../../graphql/queries/__generated__/getChannelReport.generated';
import { chartColors } from '../../../../styles/Themes';
import styled from 'styled-components';
import { WarningText } from '../../../../views/stats/styles';

const S = {
  row: styled.div`
    display: grid;
    grid-template-columns: 1fr 60px 90px;
  `,
  wrapper: styled.div`
    width: 100%;
    height: 240px;
  `,
  contentWrapper: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  title: styled.h4`
    font-weight: 900;
    margin: 8px 0;
  `,
};

export const LiquidityGraph = () => {
  const { data, loading } = useGetLiquidReportQuery({ errorPolicy: 'ignore' });

  if (loading) {
    return (
      <CardWithTitle>
        <SubTitle>Liquidity Report</SubTitle>
        <Card mobileCardPadding={'8px 0'}>
          <S.wrapper>
            <S.contentWrapper>
              <LoadingCard noCard={true} />
            </S.contentWrapper>
          </S.wrapper>
        </Card>
      </CardWithTitle>
    );
  }

  if (!data?.getChannelReport) {
    return (
      <CardWithTitle>
        <SubTitle>Liquidity Report</SubTitle>
        <Card mobileCardPadding={'8px 0'}>
          <S.wrapper>
            <S.contentWrapper>Unable to get liquidity data.</S.contentWrapper>
          </S.wrapper>
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
    { label: 'Total Commit', Value: commit },
    { label: 'Max Outgoing', Value: maxOut },
    { label: 'Max Incoming', Value: maxIn },
    { label: 'Local Balance', Value: local },
    { label: 'Remote Balance', Value: remote },
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
          <S.wrapper>
            <HorizontalBarChart
              priceLabel={true}
              data={liquidity}
              colorRange={[chartColors.green]}
            />
          </S.wrapper>
        </Card>
      </CardWithTitle>
      <CardWithTitle>
        <SubTitle>Pending HTLCs</SubTitle>
        <Card mobileCardPadding={'8px 0'}>
          {(totalPendingHtlc || 0) >= 300 && (
            <WarningText>
              You have a high amount of pending HTLCs. Be careful, a channel can
              hold a maximum of 483.
            </WarningText>
          )}
          {!totalPendingHtlc ? (
            <DarkSubTitle>
              None of your channels have pending HTLCs
            </DarkSubTitle>
          ) : (
            <S.wrapper>
              <HorizontalBarChart
                priceLabel={false}
                data={htlc}
                colorRange={[chartColors.green]}
              />
            </S.wrapper>
          )}
        </Card>
      </CardWithTitle>
    </>
  );
};
