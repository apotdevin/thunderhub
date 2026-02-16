import React from 'react';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { useGetBasePointsQuery } from '../graphql/queries/__generated__/getBasePoints.generated';
import { NodeCard } from '../views/leaderboard/NodeCard';
import { SupportBar } from '../views/home/quickActions/donate/DonateContent';
import { CardWithTitle, SubTitle, Card } from '../components/generic/Styled';
import { LoadingCard } from '../components/loading/LoadingCard';

const LeaderboardView = () => {
  const { loading, data } = useGetBasePointsQuery();

  const renderBoard = () => {
    if (loading || !data?.getBasePoints) {
      return <LoadingCard title={'Supporters'} />;
    }
    if (!data.getBasePoints.length) {
      return null;
    }
    return (
      <CardWithTitle>
        <SubTitle>Supporters</SubTitle>
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          {data.getBasePoints.map((node, index: number) => (
            <React.Fragment key={index}>
              <NodeCard node={node} index={index + 1} />
            </React.Fragment>
          ))}
        </Card>
      </CardWithTitle>
    );
  };

  return (
    <>
      <Card>
        <SupportBar />
      </Card>
      {renderBoard()}
    </>
  );
};

const LeaderboardPage = () => (
  <GridWrapper>
    <LeaderboardView />
  </GridWrapper>
);

export default LeaderboardPage;
