import { FC, useState, useEffect } from 'react';

type TimerProps = {
  initialMinute: number;
  initialSeconds: number;
};

export const Timer: FC<TimerProps> = ({ initialMinute, initialSeconds }) => {
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return minutes === 0 && seconds === 0 ? null : (
    <span className="text-xs text-muted-foreground">
      {`Expires in ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
    </span>
  );
};
