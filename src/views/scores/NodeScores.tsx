import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isArray } from 'underscore';
import {
  Card,
  CardWithTitle,
  DarkSubTitle,
  SubTitle,
} from 'src/components/generic/Styled';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { useBaseState } from 'src/context/BaseContext';
import { useGetBosNodeScoresQuery } from 'src/graphql/queries/__generated__/getBosNodeScores.generated';
import { Table } from 'src/components/table';
import { getFormatDate } from 'src/components/generic/helpers';
import numeral from 'numeral';

type NodeScoresProps = {
  callback: () => void;
  errorCallback: () => void;
};

export const NodeScores: FC<NodeScoresProps> = ({
  callback,
  errorCallback,
}) => {
  const { hasToken } = useBaseState();
  const { query } = useRouter();
  const { id } = query;

  const publicKey = (isArray(id) ? id[0] : id) || '';

  const { data, loading, error } = useGetBosNodeScoresQuery({
    skip: !hasToken,
    variables: { publicKey },
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (!error) return;
    errorCallback();
  }, [error, errorCallback]);

  useEffect(() => {
    if (loading || !data?.getBosNodeScores) return;
    callback();
  }, [loading, data, callback]);

  if (loading) {
    return <LoadingCard title={'Node Score Info'} />;
  }

  const columns = [
    { Header: 'Date', accessor: 'date' },
    { Header: 'Score', accessor: 'score' },
    { Header: 'Position', accessor: 'position' },
  ];

  const finalData = data?.getBosNodeScores || [];
  const tableData = finalData.map(s => ({
    ...s,
    score: numeral(s?.score || 0).format('0,0'),
    date: getFormatDate(s?.updated),
  }));

  return (
    <CardWithTitle>
      <SubTitle>Historical Scores</SubTitle>
      <Card>
        {!tableData.length ? (
          <DarkSubTitle>This node has no BOS score history</DarkSubTitle>
        ) : (
          <Table
            withBorder={true}
            tableData={tableData}
            tableColumns={columns}
          />
        )}
      </Card>
    </CardWithTitle>
  );
};
