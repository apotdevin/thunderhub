import React from 'react';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { GET_BASE_POINTS } from 'src/graphql/queries/getBasePoints';
import { useGetBasePointsQuery } from 'src/graphql/queries/__generated__/getBasePoints.generated';
import { renderLine } from 'src/components/generic/helpers';
import {
  CardWithTitle,
  SubTitle,
  Card,
} from '../src/components/generic/Styled';
import { LoadingCard } from '../src/components/loading/LoadingCard';

const LeaderboardView = () => {
  const { loading, data } = useGetBasePointsQuery();

  if (loading || !data?.getBasePoints) {
    return <LoadingCard title={'Donation Leaderboard'} />;
  }

  return (
    <CardWithTitle>
      <SubTitle>Leaderboard</SubTitle>
      <Card mobileCardPadding={'0'} mobileNoBackground={true}>
        {data.getBasePoints.map((node, index: number) => (
          <React.Fragment key={index}>
            {renderLine(node?.alias || 'Unknown', node?.amount)}
          </React.Fragment>
        ))}
      </Card>
    </CardWithTitle>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <LeaderboardView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context, [GET_BASE_POINTS]);
}
