import { useGetNodeQuery } from '../graphql/queries/__generated__/getNode.generated';

export const useNodeDetails = (pubkey: string) => {
  const { data, loading, error } = useGetNodeQuery({
    variables: { publicKey: pubkey },
    skip: !pubkey,
  });

  if (loading) {
    return { alias: '' };
  }

  if (!data?.getNode.node?.alias || error) {
    return { alias: 'Unknown' };
  }

  return { alias: data.getNode.node.alias };
};
