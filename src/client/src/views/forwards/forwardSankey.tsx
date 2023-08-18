import React, { FC, useMemo } from 'react';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import styled from 'styled-components';
import { mediaWidths } from '../../styles/Themes';
import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { Sankey, SankeyData } from '../../components/sankey';
import { groupBy, orderBy, reduce, uniq } from 'lodash';

const Wrapper = styled.div<{ $height: number }>`
  height: ${props => props.$height}px;
  max-height: ${props => props.$height}px;
  width: 100%;

  @media (${mediaWidths.mobile}) {
    height: ${props => props.$height}px;
  }
`;

export const ForwardSankey: FC<{
  days: number;
  type: 'amount' | 'fee' | 'tokens';
}> = ({ days, type }) => {
  const { data, loading } = useGetForwardsQuery({
    ssr: false,
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  const sankeyData: SankeyData = useMemo(() => {
    if (loading || !data || !data.getForwards.length) {
      return { links: [], nodes: [] };
    }

    const mapped = data.getForwards.map(d => ({
      ...d,
      group: `${d.incoming_channel}-${d.outgoing_channel}`,
    }));

    const grouped = groupBy(mapped, 'group');

    const aggregated: {
      incoming_channel: string;
      outgoing_channel: string;
      fee: number;
      tokens: number;
      amount: number;
    }[] = [];

    Object.entries(grouped).forEach(([, value]) => {
      const totalFees = value.map(v => v.fee).reduce((p, c) => p + c, 0);
      const totalTokens = value.map(v => v.tokens).reduce((p, c) => p + c, 0);
      const totalAmount = value.length;

      const firstValue = value[0];

      aggregated.push({
        incoming_channel: firstValue.incoming_channel,
        outgoing_channel: firstValue.outgoing_channel,
        fee: totalFees,
        tokens: totalTokens,
        amount: totalAmount,
      });
    });

    const finalData = reduce(
      aggregated,
      (p, c) => {
        const source = `source: ${c.incoming_channel}`;
        const target = `target: ${c.outgoing_channel}`;

        return {
          links: [...p.links, { source, target, value: c[type] || 0 }],
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

  if (loading || !data?.getForwards?.length) {
    return null;
  }

  const graphHeight = 800 + 10 * sankeyData.links.length;

  return (
    <Wrapper $height={graphHeight}>
      <Sankey data={sankeyData} width="100%" height={`${graphHeight}px`} />
    </Wrapper>
  );
};
