import { ParentSize } from '@visx/responsive';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { useBaseState } from 'src/context/BaseContext';
import { useGetBosNodeScoresQuery } from 'src/graphql/queries/__generated__/getBosNodeScores.generated';
import { chartColors, mediaWidths, themeColors } from 'src/styles/Themes';
import { getErrorContent } from 'src/utils/error';
import styled from 'styled-components';
import { isArray } from 'lodash';
import { AreaGraph } from './AreaGraph';

const Wrapper = styled.div`
  height: 160px;
  width: 100%;
  margin: 32px 0;

  @media (${mediaWidths.mobile}) {
    height: 80px;
  }
`;

export const Graph = () => {
  const [isPos, setIsPos] = useState<boolean>(false);
  const { hasToken } = useBaseState();
  const { query } = useRouter();
  const { id } = query;

  const toggle = () => setIsPos(p => !p);

  const publicKey = (isArray(id) ? id[0] : id) || '';

  const { data, loading } = useGetBosNodeScoresQuery({
    skip: !hasToken,
    variables: { publicKey },
    fetchPolicy: 'cache-first',
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  const scores = data?.getBosNodeScores || [];
  const final = scores
    .map(s => ({
      date: s?.updated || '',
      value: (isPos ? s?.position : s?.score) || 0,
    }))
    .reverse();

  if (!final.length) {
    return null;
  }

  return (
    <Wrapper>
      <ParentSize>
        {parent => (
          <AreaGraph
            data={final}
            width={parent.width}
            height={parent.height}
            clickCallback={toggle}
            areaColor={isPos ? themeColors.blue2 : chartColors.orange}
            lineColor={isPos ? chartColors.orange : themeColors.blue2}
            tooltipText={isPos ? 'Position:' : 'Score:'}
          />
        )}
      </ParentSize>
    </Wrapper>
  );
};
