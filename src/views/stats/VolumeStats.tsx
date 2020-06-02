import * as React from 'react';
import { useGetVolumeHealthQuery } from 'src/graphql/queries/__generated__/getVolumeHealth.generated';
import { useAccountState } from 'src/context/AccountContext';

export const VolumeStats = () => {
  const { auth } = useAccountState();
  const { data, loading } = useGetVolumeHealthQuery({
    skip: !auth,
    variables: { auth },
  });

  console.log({ data, loading });

  return <>Volume</>;
};
