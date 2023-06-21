import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { ParentSize } from '@visx/responsive';
import styled from 'styled-components';
import { mediaWidths } from '../../styles/Themes';
import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { Sankey, SankeyData } from '../../components/sankey';
import { Forward } from '../../graphql/types';

const Wrapper = styled.div`
  height: 400px;
  width: 100%;

  @media (${mediaWidths.mobile}) {
    height: 300px;
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
      if (nodeArr.indexOf(forward.incoming_channel) === -1)
        nodeArr.push(forward.incoming_channel);
      if (nodeArr.indexOf(forward.outgoing_channel) === -1)
        nodeArr.push(forward.outgoing_channel);
      orderedData.links.push({
        source: forward.incoming_channel,
        target: forward.outgoing_channel,
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
        <ParentSize>
          {parent => (
            <Sankey
              data={sankeyData}
              width={parent.width}
              height={parent.height}
            />
          )}
        </ParentSize>
      </Wrapper>
    </>
  );
};
