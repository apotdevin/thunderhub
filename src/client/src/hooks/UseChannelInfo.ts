import { useGetChannelQuery } from '../graphql/queries/__generated__/getChannel.generated';

export const useChannelInfo = (id: string) => {
  const { data, loading, error } = useGetChannelQuery({
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return { peer: { alias: '-', pubkey: '' } };
  }

  if (!data?.getChannel.partner_node_policies?.node?.node?.alias || error) {
    return { peer: { alias: 'Unknown', pubkey: '' } };
  }

  return {
    peer: {
      alias: data.getChannel.partner_node_policies.node.node.alias,
      pubkey: data.getChannel.partner_node_policies.node.node.public_key,
    },
  };
};
