import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const ScrollToTop = () => {
    let history = useHistory();

    useEffect(() => {
        const unlisten = history.listen(() => {
            window.scrollTo(0, 0);
        });
        return () => {
            unlisten();
        };
    }, [history]);

    return null;
};
