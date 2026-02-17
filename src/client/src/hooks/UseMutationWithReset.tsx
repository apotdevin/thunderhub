import { useRef, useState } from 'react';

export const useMutationResultWithReset = <T,>(
  data: T | undefined | null
): [T | undefined | null, () => void] => {
  const current = useRef(data);
  const latest = useRef(data);
  const [, setState] = useState(0);
  const clearCurrentData = () => {
    current.current = undefined;
    setState(state => state + 1);
  };

  if (data !== latest.current) {
    current.current = data;
    latest.current = data;
  }

  return [current.current, clearCurrentData];
};
