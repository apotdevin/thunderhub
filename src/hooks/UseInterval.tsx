import { useEffect, useRef } from 'react';

export const useInterval = (callback: any, delay: number) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        };
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
};
