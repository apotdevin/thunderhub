import { HorizontalBarChart } from 'src/components/chart/HorizontalBarChart';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { useGetLiquidReportQuery } from 'src/graphql/queries/__generated__/getChannelReport.generated';
import { chartColors } from 'src/styles/Themes';
import styled from 'styled-components';

const S = {
  row: styled.div`
    display: grid;
    grid-template-columns: 1fr 60px 90px;
  `,
  wrapper: styled.div`
    width: 100%;
    height: 100%;
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
      <S.wrapper>
        <S.title>Liquidity</S.title>
        <S.contentWrapper>
          <LoadingCard noCard={true} />
        </S.contentWrapper>
      </S.wrapper>
    );
  }

  if (!data?.getChannelReport) {
    return (
      <S.wrapper>
        <S.title>Liquidity</S.title>
        <S.contentWrapper>No invoices for this period.</S.contentWrapper>
      </S.wrapper>
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
    <S.wrapper>
      <HorizontalBarChart
        priceLabel={true}
        data={liquidity}
        colorRange={[chartColors.green]}
      />
    </S.wrapper>
  );
};
