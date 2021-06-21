import { useGetLiquidReportQuery } from 'src/graphql/queries/__generated__/getChannelReport.generated';
import { useNodeInfo } from 'src/hooks/UseNodeInfo';
import styled from 'styled-components';

const S = {
  wrapper: styled.div`
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  `,
  title: styled.h2`
    margin: 0;
  `,
};

export const AliasWidget = () => {
  const { alias } = useNodeInfo();

  return (
    <S.wrapper>
      <S.title>{alias}</S.title>
    </S.wrapper>
  );
};

export const BalanceWidget = () => {
  const { data } = useGetLiquidReportQuery({ errorPolicy: 'ignore' });

  if (!data?.getChannelReport) {
    return (
      <S.wrapper>
        <S.title>-</S.title>
      </S.wrapper>
    );
  }

  const { local, remote } = data.getChannelReport;

  const balance = Math.round(((local || 0) / (remote || 1)) * 100);

  return (
    <S.wrapper>
      <S.title>{`${balance}%`}</S.title>
    </S.wrapper>
  );
};
