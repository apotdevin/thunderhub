import React, { useState, useEffect } from 'react';
import { DarkSubTitle } from 'src/components/generic/Styled';
import styled from 'styled-components';

const Wrapper = styled(DarkSubTitle)`
  width: 100%;
  text-align: center;
`;

type TimerProps = {
  initialMinute: number;
  initialSeconds: number;
};

export const Timer: React.FC<TimerProps> = ({
  initialMinute,
  initialSeconds,
}) => {
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
    <Wrapper>
      {`Will disappear in ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
    </Wrapper>
  );
};
