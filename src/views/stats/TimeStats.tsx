import * as React from 'react';
import { useAccountState } from 'src/context/AccountContext';
import { useGetTimeHealthQuery } from 'src/graphql/queries/__generated__/getTimeHealth.generated';

export const TimeStats = () => {
  const { auth } = useAccountState();
  const { data, loading } = useGetTimeHealthQuery({
    skip: !auth,
    variables: { auth },
  });

  console.log({ data, loading });

  return <>Time</>;
};
