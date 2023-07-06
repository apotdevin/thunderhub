import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import styled from 'styled-components';
import { mediaWidths } from '../../styles/Themes';
import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { Sankey, SankeyData } from '../../components/sankey';
import { Forward } from '../../graphql/types';

const SANKEY_HEIGHT_DESKTOP = '800px';

const Wrapper = styled.div`
  height: ${SANKEY_HEIGHT_DESKTOP};
  width: 100%;

  @media (${mediaWidths.mobile}) {
    height: ${SANKEY_HEIGHT_DESKTOP};
  }
`;

export const ForwardSankey = ({ days }: { days: number }) => {
  const { data, loading } = useGetForwardsQuery({
    ssr: false,
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  const sankeyData = useMemo(() => {
    if (loading || !data || !data.getForwards.length)
      return { links: [], nodes: [] };
    const orderedData: SankeyData = { links: [], nodes: [] };
    const nodeArr: string[] = [];

    // We need to put unique nodes in an array for future sorting
    data.getForwards.map((forward: Forward) => {
      const source = `source: ${forward.incoming_channel}`;
      const target = `target: ${forward.outgoing_channel}`;
      if (nodeArr.indexOf(source) === -1) nodeArr.push(source);
      if (nodeArr.indexOf(target) === -1) nodeArr.push(target);
      orderedData.links.push({
        source,
        target,
        value: forward.tokens,
      });
    });

    orderedData.nodes = nodeArr.map(node => {
      return { name: node };
    });

    return orderedData;
  }, [data]);

  if (loading || !data?.getForwards?.length) {
    return null;
  }

  return (
    <>
      <Wrapper>
        <Sankey data={sankeyData} width="100%" height={SANKEY_HEIGHT_DESKTOP} />
      </Wrapper>
    </>
  );
};
