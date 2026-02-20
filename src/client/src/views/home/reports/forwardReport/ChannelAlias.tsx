import { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { useGetChannelQuery } from '../../../../graphql/queries/__generated__/getChannel.generated';
import { useGetClosedChannelsQuery } from '../../../../graphql/queries/__generated__/getClosedChannels.generated';
import { themeColors } from '../../../../styles/Themes';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Info } from 'lucide-react';
import styled from 'styled-components';
import { getAliasFromClosedChannels } from './helpers';

const S = {
  icon: styled.span`
    margin-left: 4px;
  `,
};

export const ChannelAlias: FC<{ id: string }> = ({ id }) => {
  const { data: closedChannelData } = useGetClosedChannelsQuery({
    skip: !id,
    errorPolicy: 'ignore',
  });

  const { data, loading } = useGetChannelQuery({
    skip: !id,
    errorPolicy: 'ignore',
    variables: { id },
  });

  if (!id) {
    return <>Unknown</>;
  }

  if (loading) {
    return (
      <Loader2
        className="animate-spin"
        size={8}
        style={{ color: themeColors.blue3 }}
      />
    );
  }

  if (data?.getChannel.partner_node_policies?.node?.node?.alias) {
    return <>{data.getChannel.partner_node_policies.node.node.alias}</>;
  }

  if (closedChannelData?.getClosedChannels?.length) {
    const { alias: closedAlias, closed } = getAliasFromClosedChannels(
      id,
      closedChannelData.getClosedChannels
    );

    if (closed) {
      return (
        <>
          {closedAlias}
          <S.icon>
            <Info size={16} data-tip data-for={'channel_info'} />
          </S.icon>
          <ReactTooltip id={'channel_info'} place={'right'}>
            This channel has been closed.
          </ReactTooltip>
        </>
      );
    }

    return <>{closedAlias}</>;
  }

  return <>Unknown</>;
};
