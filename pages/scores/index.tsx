import React from 'react';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { useGetBosScoresQuery } from 'src/graphql/queries/__generated__/getBosScores.generated';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { ScoreCard } from 'src/views/scores/ScoreCard';
import {
  Card,
  CardWithTitle,
  DarkSubTitle,
  Separation,
  SingleLine,
  SubTitle,
} from 'src/components/generic/Styled';
import { useNodeInfo } from 'src/hooks/UseNodeInfo';
import { getFormatDate, getNodeLink } from 'src/components/generic/helpers';
import { Table } from 'src/components/table';
import { BarChart2 } from 'react-feather';
import styled from 'styled-components';
import { chartColors } from 'src/styles/Themes';
import { Link } from 'src/components/link/Link';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import numeral from 'numeral';

const S = {
  Icon: styled.div`
    cursor: pointer;

    &:hover {
      color: ${chartColors.orange};
    }
  `,
};

const Wrapped = () => {
  const { publicKey } = useNodeInfo();
  const { data, loading } = useGetBosScoresQuery({
    onError: err => toast.error(getErrorContent(err)),
  });

  if (loading) {
    return (
      <GridWrapper>
        <LoadingCard title={'BOS Scores'} />
      </GridWrapper>
    );
  }

  const scores = data?.getBosScores?.scores.filter(Boolean) || [];
  const date = data?.getBosScores?.updated || '';

  const thisNode =
    scores.find(score => score?.public_key === publicKey) || null;

  const columns = [
    { Header: 'Index', accessor: 'index' },
    { Header: 'Alias', accessor: 'alias' },
    { Header: 'PubKey', accessor: 'key' },
    { Header: 'Position', accessor: 'position' },
    { Header: 'Score', accessor: 'score' },
    { Header: 'History', accessor: 'chart' },
  ];

  const tableData = scores.map((s, index) => ({
    ...s,
    score: numeral(s.score).format('0,0'),
    index: index + 1,
    key: getNodeLink(s?.public_key),
    chart: (
      <Link to={`/scores/${s?.public_key}`}>
        <S.Icon>
          <BarChart2 />
        </S.Icon>
      </Link>
    ),
  }));

  return (
    <GridWrapper>
      <CardWithTitle>
        <SingleLine>
          <SubTitle>BOS Scores</SubTitle>
          <DarkSubTitle>{`Updated: ${getFormatDate(date)}`}</DarkSubTitle>
        </SingleLine>
        <Card>
          <ScoreCard score={thisNode} />
          <Separation />
          <Table
            filterPlaceholder={'nodes'}
            withBorder={true}
            tableData={tableData}
            tableColumns={columns}
          />
        </Card>
      </CardWithTitle>
    </GridWrapper>
  );
};

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
