import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { isArray } from 'lodash';
import {
  Card,
  CardWithTitle,
  DarkSubTitle,
  SubTitle,
} from '../../components/generic/Styled';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Table } from '../../components/table';
import { getFormatDate, renderLine } from '../../components/generic/helpers';
import numeral from 'numeral';
import { useAmbossUser } from '../../hooks/UseAmbossUser';
import { useGetNodeBosHistoryQuery } from '../../graphql/queries/__generated__/getNodeBosHistory.generated';
import { toast } from 'react-toastify';

export const NodeScores: FC = () => {
  const { user } = useAmbossUser();
  const { query } = useRouter();
  const { id } = query;

  const pubkey = (isArray(id) ? id[0] : id) || '';

  const { data, loading } = useGetNodeBosHistoryQuery({
    skip: !user?.subscribed,
    variables: { pubkey },
    onError: () => toast.error('Error getting this nodes BOS score history'),
  });

  if (loading) {
    return <LoadingCard title={'Node Score Info'} />;
  }

  const columns = [
    { Header: 'Date', accessor: 'date' },
    { Header: 'Score', accessor: 'score' },
    { Header: 'Position', accessor: 'position' },
  ];

  const finalData = data?.getNodeBosHistory.scores || [];
  const tableData = finalData.map(s => ({
    ...s,
    score: numeral(s?.score || 0).format('0,0'),
    date: getFormatDate(s?.updated),
  }));

  const renderInfo = () => {
    if (!data?.getNodeBosHistory.info) {
      return null;
    }

    const { count, first, last } = data.getNodeBosHistory.info;

    if (!count) {
      return null;
    }

    return (
      <>
        <CardWithTitle>
          <SubTitle>Historical Info</SubTitle>
          <Card>
            {renderLine('Last time seen', getFormatDate(last?.updated))}
            {renderLine('Last score', last?.score)}
            {renderLine('Last position', last?.position)}
            {renderLine('Amount of times seen', count)}
            {renderLine('First time seen', getFormatDate(first?.updated))}
          </Card>
        </CardWithTitle>
      </>
    );
  };

  return (
    <>
      {renderInfo()}
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
    </>
  );
};
