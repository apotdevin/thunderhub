import { useState, useEffect } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';

export const useSwapExpire = (date?: string) => {
  const [, setCount] = useState(0);

  useEffect(() => {
    const myInterval = setInterval(() => {
      setCount(p => p + 1);
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  if (!date) return '';
  return `(Expires in ${formatDistanceToNowStrict(new Date(date), {
    unit: 'second',
  })})`;
};
