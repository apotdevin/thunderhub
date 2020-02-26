import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

const getSize = () => {
    const isClient = typeof window === 'object';
    return {
        width: isClient ? window.innerWidth : 0,
        height: isClient ? window.innerHeight : 0,
    };
};

export const useSize = () => {
    const [windowSize, setWindowSize] = useState(getSize());

    useEffect(() => {
        const handleResize = () => {
            setWindowSize(getSize());
        };

        handleResize();

        const debouncedHandle = debounce(handleResize, 250);
        window.addEventListener('resize', debouncedHandle);
        return () => window.removeEventListener('resize', debouncedHandle);
    }, []);

    return windowSize;
};
