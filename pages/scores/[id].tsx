import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { NodeInfo } from 'src/views/scores/NodeInfo';
import { useRouter } from 'next/router';
import { useBaseDispatch, useBaseState } from 'src/context/BaseContext';
import { useEffect, useState } from 'react';
import { appendBasePath } from 'src/utils/basePath';
import { NodeScores } from 'src/views/scores/NodeScores';
import { Graph } from 'src/views/scores/NodeGraph';
import { useDeleteBaseTokenMutation } from 'src/graphql/mutations/__generated__/deleteBaseToken.generated';

const NodeScoreView = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const { push } = useRouter();

  const { hasToken } = useBaseState();
  const dispatch = useBaseDispatch();

  const [deleteToken] = useDeleteBaseTokenMutation();

  useEffect(() => {
    if (!hasToken) {
      push(appendBasePath('/token'));
    }
  }, [hasToken, push]);

  const handleAuthError = () => {
    dispatch({ type: 'change', hasToken: false });
    deleteToken();
    push(appendBasePath('/token'));
  };

  return (
    <>
      {!loading && (
        <>
          <Graph />
          <NodeInfo />
        </>
      )}
      <NodeScores
        callback={() => setLoading(false)}
        errorCallback={handleAuthError}
      />
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
