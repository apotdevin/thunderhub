import * as React from 'react';
import { useAccountState } from 'src/context/AccountContext';
import { useGetFeeHealthQuery } from 'src/graphql/queries/__generated__/getFeeHealth.generated';

export const FeeStats = () => {
  const { auth } = useAccountState();
  const { data, loading } = useGetFeeHealthQuery({
    skip: !auth,
    variables: { auth },
  });

  console.log({ data, loading });

  return <>Fee</>;
};
