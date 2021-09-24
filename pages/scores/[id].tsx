import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { NodeInfo } from 'src/views/scores/NodeInfo';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NodeScores } from 'src/views/scores/NodeScores';
import { Graph } from 'src/views/scores/NodeGraph';
import { useAmbossUser } from 'src/hooks/UseAmbossUser';

const NodeScoreView = () => {
  const { user, loading } = useAmbossUser();
  const { push } = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user?.subscribed) return;
    push('/token');
  }, [user, push, loading]);

  return (
    <>
      <Graph />
      <NodeInfo />
      <NodeScores />
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <NodeScoreView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
