import { FC, useMemo } from 'react';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../utils/error';
import styled from 'styled-components';
import { mediaWidths } from '../../styles/Themes';
import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { Sankey, SankeyData } from '../../components/sankey';
import { orderBy, reduce, uniq } from 'lodash';
import { AggregatedRouteForwards } from '../../graphql/types';

const Wrapper = styled.div<{ $height: number }>`
  height: ${props => props.$height}px;
  max-height: ${props => props.$height}px;
  width: 100%;

  @media (${mediaWidths.mobile}) {
    height: ${props => props.$height}px;
  }
`;

const getValue = (item: AggregatedRouteForwards, type: string) => {
  switch (type) {
    case 'count':
      return item.count;
    case 'tokens':
      return item.tokens;
    case 'fee':
      return item.fee;
    default:
      return 0;
  }
};

export const ForwardSankey: FC<{
  days: number;
  type: string;
}> = ({ days, type }) => {
  const { data, loading } = useGetForwardsQuery({
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  const sankeyData: SankeyData = useMemo(() => {
    if (loading || !data || !data.getForwards.by_route.length) {
      return { links: [], nodes: [] };
    }

    const finalData = reduce(
      data.getForwards.by_route,
      (p, c) => {
        const source = `source: ${
          c.incoming_channel_info?.node2_info?.alias || 'Unknown'
        } (${c.incoming_channel})`;
        const target = `target: ${
          c.outgoing_channel_info?.node2_info?.alias || 'Unknown'
        } (${c.outgoing_channel})`;

        return {
          links: [...p.links, { source, target, value: getValue(c, type) }],
          nodes: [...p.nodes, source, target],
        };
      },
      {
        links: [] as { source: string; target: string; value: number }[],
        nodes: [] as string[],
      }
    );

    return {
      links: orderBy(finalData.links, 'value', 'desc'),
      nodes: uniq(finalData.nodes).map(n => ({ name: n })),
    };
  }, [data, loading, type]);

  if (loading || !data?.getForwards.by_route.length) {
    return null;
  }

  const graphHeight = 800 + 16 * sankeyData.links.length;

  return (
    <Wrapper $height={graphHeight}>
      <Sankey data={sankeyData} width="100%" height={`${graphHeight}px`} />
    </Wrapper>
  );
};
