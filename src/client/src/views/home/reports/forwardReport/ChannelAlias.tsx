import { FC } from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { useGetChannelQuery } from '../../../../graphql/queries/__generated__/getChannel.generated';
import { useGetClosedChannelsQuery } from '../../../../graphql/queries/__generated__/getClosedChannels.generated';
import { useNodeInfo } from '../../../../hooks/UseNodeInfo';
import { themeColors } from '../../../../styles/Themes';
import ReactTooltip from 'react-tooltip';
import { Info } from 'react-feather';
import styled from 'styled-components';
import { getAliasFromClosedChannels } from './helpers';

const S = {
  icon: styled.span`
    margin-left: 4px;
  `,
};

export const ChannelAlias: FC<{ id: string }> = ({ id }) => {
  const { publicKey } = useNodeInfo();

  const { data: closedChannelData } = useGetClosedChannelsQuery({
    skip: !id || !publicKey,
    errorPolicy: 'ignore',
  });

  const { data, loading } = useGetChannelQuery({
    skip: !id || !publicKey,
    errorPolicy: 'ignore',
    variables: { id, pubkey: publicKey },
  });

  if (!id || !publicKey) {
    return <>Unknown</>;
  }

  if (loading) {
    return <ScaleLoader height={8} color={themeColors.blue3} />;
  }

  if (data?.getChannel.partner_node_policies?.node?.node.alias) {
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
          <ReactTooltip id={'channel_info'} effect={'solid'} place={'right'}>
            This channel has been closed.
          </ReactTooltip>
        </>
      );
    }

    return <>{closedAlias}</>;
  }

  return <>Unknown</>;
};
