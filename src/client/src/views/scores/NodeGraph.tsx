import { ParentSize } from '@visx/responsive';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { chartColors, mediaWidths, themeColors } from '../../styles/Themes';
import { getErrorContent } from '../../utils/error';
import styled from 'styled-components';
import { isArray } from 'lodash';
import { useGetNodeBosHistoryQuery } from '../../graphql/queries/__generated__/getNodeBosHistory.generated';
import { useAmbossUser } from '../../hooks/UseAmbossUser';
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
  const { user } = useAmbossUser();
  const { query } = useRouter();
  const { id } = query;

  const toggle = () => setIsPos(p => !p);

  const pubkey = (isArray(id) ? id[0] : id) || '';

  const { data, loading } = useGetNodeBosHistoryQuery({
    skip: !user?.subscribed || !pubkey,
    variables: { pubkey },
    fetchPolicy: 'cache-first',
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  const scores = data?.getNodeBosHistory.scores || [];
  const final = scores.map(s => ({
    date: s?.updated || '',
    value: (isPos ? s?.position : s?.score) || 0,
  }));

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
