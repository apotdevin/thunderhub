import { useState, useEffect } from 'react';

export const useSwapExpire = (date?: string) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!date) return '';

  const diff = Math.max(0, Math.floor((new Date(date).getTime() - now) / 1000));

  if (diff <= 0) return '(Expired)';

  const hours = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const secs = diff % 60;

  const time =
    hours > 0
      ? `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;

  return `(Expires in ${time})`;
};
