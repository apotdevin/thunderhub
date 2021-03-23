import { useState, useEffect } from 'react';
import { useGetBitcoinFeesQuery } from 'src/graphql/queries/__generated__/getBitcoinFees.generated';

type State = {
  dontShow: boolean;
  fast: number;
  halfHour: number;
  hour: number;
  minimum: number;
};

const initialState: State = {
  dontShow: true,
  fast: 0,
  halfHour: 0,
  hour: 0,
  minimum: 0,
};

export const useBitcoinFees = (): State => {
  const [bitcoinFees, setBitcoinFees] = useState<State>(initialState);

  const { loading, data, error } = useGetBitcoinFeesQuery({
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (error) {
      setBitcoinFees(initialState);
    }
  }, [error]);

  useEffect(() => {
    if (!loading && data && data.getBitcoinFees) {
      const { fast, halfHour, hour, minimum } = data.getBitcoinFees;
      setBitcoinFees({
        fast: fast || 0,
        halfHour: halfHour || 0,
        hour: hour || 0,
        dontShow: false,
        minimum: minimum || 0,
      });
    }
  }, [data, loading]);

  return bitcoinFees;
};
